import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getCompanyInfo } from "./company-info";
import { getCompetitors } from "./get-competitors";
import { getFounderInfo, assessFounderMarketFit } from "./get-personal-info";
import { getCompanyFinancials } from "./get-financials";
import { generateReport } from "../deep-research/index";

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
      getFinancialInformation: tool({
        description: "Get financial information about a company",
        parameters: z.object({
          companyName: z.string(),
        }),
        execute: async ({ companyName }) => {
          return await getCompanyFinancials(companyName);
        },
      }),
      generateInvestmentPitch: tool({
        description: "Generate an investment pitch for a company",
        parameters: z.object({
          companyName: z.string(),
          companyInfo: z.string(),
          competitors: z.array(z.string()),
          founderInfo: z.string(),
          financialInfo: z.string(),
        }),
        execute: async ({
          companyName,
          companyInfo,
          competitors,
          founderInfo,
          financialInfo,
        }) => {
          return await generateReport({
            query: companyName,
            queries: [],
            searchResults: [],
            learnings: [],
            completedQueries: [],
            ...JSON.parse(
              JSON.stringify({
                companyInfo,
                competitors,
                founderInfo,
                financialInfo,
              }),
            ),
          });
        },
      }),
    },
  });
};
