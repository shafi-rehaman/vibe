import z from "zod";
import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createTool,
  type Message,
  createState,
  anthropic,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import {
  getSandbox,
  lastAssistantTextMessageContent,
  parseAgentOutput,
} from "./utils";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import prisma from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "codeAgent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test2-shafi");
      await sandbox.setTimeout(60_000 * 10 * 1.5);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "expert coder",
      description: "You are a expert coding agent",
      system: PROMPT,
      model: anthropic({
        model: "claude-sonnet-4-5",
        defaultParameters: { max_tokens: 5000 },
      }),
      // model:gemini({model:'gemini-2.0-flash'}),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout(data: string) {
                    buffers.stdout += data;
                  },
                  onStderr(data: string) {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the Sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),

          handler: async ({ files }, { step, network }) => {
            const newFile = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
          
                // -------------------------------
                // 🔥 CLAUDE-SAFE FILE PARSING
                // -------------------------------
          
                let parsedFiles = files;
          
                // Case 1: null / undefined
                if (!parsedFiles) {
                  parsedFiles = [];
                }
          
                // Case 2: stringified array
                if (typeof parsedFiles === "string") {
                  try {
                    parsedFiles = JSON.parse(parsedFiles);
                  } catch {
                    parsedFiles = [];
                  }
                }
          
                // Case 3: object instead of array (Claude bug)
                if (!Array.isArray(parsedFiles)) {
                  parsedFiles = [];
                }
          
                // Now parsedFiles is ALWAYS a safe array
                // ----------------------------------------
          
                for (const file of parsedFiles) {
                  // OPTIONAL: TSX integrity check
                  if (file.path.endsWith(".tsx") || file.path.endsWith(".ts")) {
                    const trimmed = file.content.trim();
                    if (
                      !trimmed.endsWith("}") &&
                      !trimmed.endsWith("</div>") &&
                      !trimmed.endsWith("</main>") &&
                      !trimmed.endsWith("</section>")
                    ) {
                      console.warn(`⚠ Possible incomplete file: ${file.path}`);
                    }
                  }
          
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
          
                return updatedFiles;
          
              } catch (e) {
                return `Error: ${e}`;
              }
            });
          
            if (typeof newFile === "object") {
              network.state.data.files = newFile;
            }
          }
          

        }),
        createTool({
          name: "readFiles",
          description: "Read files from sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return `Error: ${e}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            const match = lastAssistantMessageText?.match(
              /<task_summary>([\s\S]*?)<\/task_summary>/
            );

            if (match?.[1]) {
              network.state.data.summary = match[1].trim();
            }
          }
          return result;
        },
      },
    });
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent<AgentState>({
      name: "fragment-title-generator",
      description: "Fragment tiltle genrator",
      system: FRAGMENT_TITLE_PROMPT,
      model: anthropic({
        model: "claude-3-5-haiku-20241022",
        defaultParameters: { max_tokens: 100 },
      }),
    });

    const responseGenerator = createAgent<AgentState>({
      name: "response-Generator",
      description: "A response genrator",
      system: RESPONSE_PROMPT,
      model: anthropic({
        model: "claude-3-5-haiku-20241022",
        defaultParameters: { max_tokens: 100 },
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary
    );
    // const hasSummary = Boolean(result.state.data.summary?.trim());
    const hasFiles =
      result.state.data.files &&
      Object.keys(result.state.data.files).length > 0;

    const isError = !hasFiles; // summary failure should NOT count as error

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content:
              result.state.data.summary ||
              "Failed to generate code. Please ensure your request is clear and try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
