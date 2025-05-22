import { exa } from "./shared";

const fetchCrunchbase = async (company: string) => {
  const result = await exa.searchAndContents(`${company} crunchbase page:`, {
    type: "keyword",
    numResults: 1,
    includeDomains: ["crunchbase.com"],
    includeText: [company],
  });
  return result.results[0];
};

const fetchFunding = async (company: string) => {
  const result = await exa.searchAndContents(`${company} Funding:`, {
    type: "keyword",
    numResults: 1,
    text: true,
    summary: {
      query: `Tell me about the funding (and if available, the valuation) of this company in detail. Do not tell me about the company, just give all the funding information in detail. If funding or valuation info is not preset, just reply with one word "NO".`,
    },
    livecrawl: "always",
    includeText: [company],
  });
  return result.results[0];
};
