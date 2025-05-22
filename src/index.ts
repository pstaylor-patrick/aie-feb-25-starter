import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import 'dotenv/config'
 
const main = async () => {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'When is the AI Engineer summit?',
  })
  console.log(result.text)
}
 
main()