import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import 'dotenv/config'
 
const main = async () => {
  const result = await generateText({
    model: google('gemini-2.0-flash-001', { useSearchGrounding: true }),
    prompt: 'When is the AI Engineer summit?',
  })
  console.log(result.text, result.sources)
}
 
main()