import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import 'dotenv/config'
 
const mainModel = openai('gpt-4o')
 
const generateSearchQueries = async (query: string, n: number = 3) => {
  const {
    object: { queries },
  } = await generateObject({
    model: mainModel,
    prompt: `Generate ${n} search queries for the following query: ${query}`,
    schema: z.object({
      queries: z.array(z.string()).min(1).max(5),
    }),
  })
  return queries
}

const main = async () => {
  const prompt = 'What do you need to be a D1 shotput athlete?'
  const queries = await generateSearchQueries(prompt)
  console.log(queries)
}

main()

import Exa from 'exa-js'
 
const exa = new Exa(process.env.EXA_API_KEY)
 
type SearchResult = {
  title: string
  url: string
  content: string
}
 
const searchWeb = async (query: string) => {
  const { results } = await exa.searchAndContents(query, {
    numResults: 1,
    livecrawl: 'always',
  })
  return results.map(
    (r) =>
      ({
        title: r.title,
        url: r.url,
        content: r.text,
      }) as SearchResult
  )
}