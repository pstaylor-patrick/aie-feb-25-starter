import { perplexity } from "@ai-sdk/perplexity";
import { generateText } from "ai";

const fetchCompetitorsPerplexity = async (company: string, n: number = 2) => {
  console.log(`Getting competitors for ${company}`);

  const { text: competitorsRaw, sources } = await generateText({
    model: perplexity("sonar-pro"),
    system: "You are an expert analyst and researcher.",
    prompt: `Please identify similar competitors (max ${n}) to the following company: ${company}.
  For each competitor, provide a brief description of their product, a link to their website, and an explanation of why they are similar.`,
  });
  return { competitorsRaw, sources };
};
