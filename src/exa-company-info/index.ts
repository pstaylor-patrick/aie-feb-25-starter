import { perplexity } from "@ai-sdk/perplexity";
import { generateText, Output, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import "dotenv/config";
import Exa from "exa-js";

export const exa = new Exa(process.env.EXA_API_KEY);

const companyInfoPrompt = (
  company: string,
) => `For the following company provide:
- a brief company description
- what do they sell / what products do they offer
 
<company>${company}</company>`;

const fetchCompanyInfoWithPerplexity = async (company: string) => {
  const { text: description, sources } = await generateText({
    model: perplexity("sonar-pro"),
    prompt: companyInfoPrompt(company),
  });
  return { description, sources };
};

const fetchCompanyInfoFromWeb = async (company: string) => {
  const { experimental_output: object } = await generateText({
    model: openai("gpt-4o"),
    prompt: companyInfoPrompt(company),
    tools: {
      searchWeb: tool({
        description: "Search the web for information about a company",
        parameters: z.object({
          query: z.string().min(1).max(100).describe("The search query"),
        }),
        execute: async ({ query }) => {
          const { results } = await exa.searchAndContents(query, {
            livecrawl: "always",
            numResults: 5,
          });
          return { results };
        },
      }),
    },
    maxSteps: 3,
    experimental_output: Output.object({
      schema: z.object({
        description: z.string(),
        products: z
          .array(z.string())
          .describe("The products offered by the company"),
      }),
    }),
  });
  return object;
};

const main = async () => {
  console.log("hello world");
};

main();
