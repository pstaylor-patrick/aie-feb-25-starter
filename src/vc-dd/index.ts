import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const main = async (prompt: string) => {
  const { fullStream } = streamText({
    model: openai("gpt-4o"),
    prompt,
    maxSteps: 10,
  });
};
