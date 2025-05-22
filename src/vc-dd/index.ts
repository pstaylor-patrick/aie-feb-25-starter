import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getCompanyInfo } from "./company-info";
import { getCompetitors } from "./get-competitors";

const main = async (prompt: string) => {
  const { fullStream } = streamText({
    model: openai("gpt-4o"),
    prompt,
    maxSteps: 10,
    tools: {
      getCompanyInfo: tool({
        description: "Get information about a company",
        parameters: z.object({
          companyName: z.string(),
        }),
        execute: async ({ companyName }) => {
          return await getCompanyInfo(companyName);
        },
      }),
      getCompetitors: tool({
        description: "Get competitors of a company",
        parameters: z.object({
          companyName: z.string(),
        }),
        execute: async ({ companyName }) => {
          return await getCompetitors(companyName);
        },
      }),
    },
  });
};
