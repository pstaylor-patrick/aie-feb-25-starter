import "dotenv/config";
import Exa from "exa-js";

export const exa = new Exa(process.env.EXA_API_KEY);

const companyInfoPrompt = (
  company: string,
) => `For the following company provide:
- a brief company description
- what do they sell / what products do they offer
 
<company>${company}</company>`;

const main = async () => {
  console.log("hello world");
};

main();
