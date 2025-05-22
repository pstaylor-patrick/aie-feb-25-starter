import { exa } from "./shared";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const getFounderTweets = async (founder: string) => {
  const { results: twitterProfiles } = await exa.searchAndContents(
    `${founder} Twitter (X) profile:`,
    {
      type: "keyword",
      text: true,
      numResults: 3,
      livecrawl: "always",
      includeDomains: ["x.com", "twitter.com"],
    },
  );

  // Extract username using GPT-4
  const {
    object: { username },
  } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      username: z
        .string()
        .min(1)
        .describe(`${founder} Twitter username`)
        .nullable(),
    }),
    prompt: `Please extract the Twitter username for ${founder} from the following text: ${JSON.stringify(twitterProfiles)}`,
  });

  // Fetch tweets if username found
  if (!username) {
    return `Could not find Twitter username for ${founder}`;
  }

  const result = await exa.searchAndContents(
    `tweets from:${username} -filter:replies`,
    {
      type: "keyword",
      livecrawl: "always",
      includeDomains: ["twitter.com", "x.com"],
      includeText: [username],
    },
  );
  return result.results;
};
