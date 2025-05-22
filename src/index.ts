import { perplexity } from '@ai-sdk/perplexity'
import { generateText } from 'ai'
import 'dotenv/config'
 
const main = async () => {
  const result = await generateText({
    model: perplexity('sonar'),
    prompt: 'When is the AI Engineer summit?',
  })
  console.log(result.text)
}
 
main()