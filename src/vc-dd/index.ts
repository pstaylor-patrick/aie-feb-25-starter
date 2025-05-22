import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getCompanyInfo } from "./company-info";
import { getCompetitors } from "./get-competitors";
import { getFounderInfo } from "./get-personal-info";
import { assessFounderMarketFit } from "./get-personal-info";

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
      getPersonInfo: tool({
        description:
          "Get information (tweets, blog posts, linkedin profile) about a person",
        parameters: z.object({
          name: z.string(),
        }),
        execute: async ({ name: founderName }) => {
          return await getFounderInfo(founderName);
        },
      }),
      assessFounderMarketFit: tool({
        description: "Assess the market fit of a founder",
        parameters: z.object({
          founderName: z.string(),
          companyInfo: z.string(),
        }),
        execute: async ({ founderName, companyInfo }) => {
          return await assessFounderMarketFit({ founderName, companyInfo });
        },
      }),
    },
  });
};
