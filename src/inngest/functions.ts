import { inngest } from "./client";
import { createAgent, gemini } from '@inngest/agent-kit';
import {Sandbox} from '@e2b/code-interpreter';
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step}) => {
    const sandboxId = await step.run("get-sandbox-id", async ()=>{
      const sandbox = await Sandbox.create("vibe-nextjs-test2-shafi")
      return sandbox.sandboxId;
    })
    const codeAgent = createAgent({
        name : "expert coder",
        system: "You are an expert Next.js developer. Generate only clean, secure, and functional Next.js/React code snippets. Do not include explanations or comments. Ensure all generated code follows React best practices and is production-ready.",
        model: gemini({model:"gemini-1.5-flash"}),
    });

    const {output} = await codeAgent.run(
        `Write the following snippet: ${event.data.value}`
    )

    const sandboxUrl = await step.run("get-sandbox-url", async ()=>{
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`
    })

    return {output, sandboxUrl};
  },
);