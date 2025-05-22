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
