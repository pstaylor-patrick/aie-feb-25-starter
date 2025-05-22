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

const searchAndProcess = async (query: string) => {
    const pendingSearchResults: SearchResult[] = []
    const finalSearchResults: SearchResult[] = []
    await generateText({
        model: mainModel,
        prompt: `Search the web for information about ${query}`,
        system:
        'You are a researcher. For each query, search the web and then evaluate if the results are relevant and will help answer the following query',
        maxSteps: 5,
        tools: {
        searchWeb: tool({
            description: 'Search the web for information about a given query',
            parameters: z.object({
            query: z.string().min(1),
            }),
            async execute({ query }) {
            const results = await searchWeb(query)
            pendingSearchResults.push(...results)
            return results
            },
        }),
        evaluate: tool({
            description: 'Evaluate the search results',
            parameters: z.object({}),
            async execute() {
            const pendingResult = pendingSearchResults.pop()!
            const { object: evaluation } = await generateObject({
                model: mainModel,
                prompt: `Evaluate whether the search results are relevant and will help answer the following query: ${query}. If the page already exists in the existing results, mark it as irrelevant.

                <search_results>
                ${JSON.stringify(pendingResult)}
                </search_results>
                `,
                output: 'enum',
                enum: ['relevant', 'irrelevant'],
            })
            if (evaluation === 'relevant') {
                finalSearchResults.push(pendingResult)
            }
            console.log('Found:', pendingResult.url)
            console.log('Evaluation completed:', evaluation)
            return evaluation === 'irrelevant'
                ? 'Search results are irrelevant. Please search again with a more specific query.'
                : 'Search results are relevant. End research for this query.'
            },
        }),
        },
    })
    return finalSearchResults
}