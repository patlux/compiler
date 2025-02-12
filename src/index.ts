import { tokenize } from './tokenizer'

const content = await Bun.file('./src/test.ts').text()
console.log({ content })

const tokens = tokenize(content)

console.log(tokens)
