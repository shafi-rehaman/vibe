
import { inngest } from "./client";
import { createAgent, gemini } from '@inngest/agent-kit';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
        name : "summarizer",
        system: "You are an expert next.js developer. You write readable, maintainable code. You write simple Next.js & React snippets. dont answer anything just give the code as possible",
        model: gemini({model:"gemini-1.5-flash"}),
    });

    const {output} = await codeAgent.run(
        `Write the following snippet: ${event.data.value}`
    )
    return output;
  },
);