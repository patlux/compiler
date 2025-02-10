const content = await Bun.file('./src/test.ts').text()
console.log({ content })

const KEYWORDS = ['function', 'const'] as const
type Keyword = (typeof KEYWORDS)[number]

type Token =
  | {
      type: 'LeftCurly'
    }
  | { type: 'RightCurly' }
  | { type: 'LeftParen' }
  | { type: 'RightParen' }
  | { type: 'dot' }
  | { type: 'equals' }
  | { type: 'identifier'; value: string }
  | { type: 'string'; value: string }
  | { type: 'keyword'; value: Keyword }

const tokens: Token[] = []

const ctx = { pos: 0 }

while (ctx.pos < content.length) {
  const char = content.charAt(ctx.pos)
  // console.log({ char })

  switch (char) {
    case '.': {
      tokens.push({
        type: 'dot',
      })
      ctx.pos++
      continue
    }
    case '{': {
      tokens.push({
        type: 'LeftCurly',
      })
      ctx.pos++
      continue
    }
    case '}': {
      tokens.push({
        type: 'RightCurly',
      })
      ctx.pos++
      continue
    }
    case '(': {
      tokens.push({
        type: 'LeftParen',
      })
      ctx.pos++
      continue
    }
    case ')': {
      tokens.push({
        type: 'RightParen',
      })
      ctx.pos++
      continue
    }
    case '=': {
      tokens.push({
        type: 'equals',
      })
      ctx.pos++
      continue
    }
    case ' ': {
      ctx.pos++
      continue
    }
  }

  if (isValidChar(char)) {
    const identifier = readIdentifier(content, ctx)

    if (KEYWORDS.includes(identifier as Keyword)) {
      tokens.push({ type: 'keyword', value: identifier as Keyword })
    } else {
      tokens.push({ type: 'identifier', value: identifier })
    }

    continue
  }

  if (isQuote(char)) {
    ctx.pos++
    const value = readStringLiteral(content, ctx)
    tokens.push({ type: 'string', value: value })
    continue
  }

  ctx.pos++
  continue
}

function isValidChar(char: string) {
  return (
    (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90) ||
    (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122) ||
    char === '_'
  )
}

function readIdentifier(content: string, ctx: { pos: number }): string {
  let identifier = ''
  while (true) {
    const char = content.charAt(ctx.pos)
    if (!isValidChar(char)) {
      break
    }
    identifier += char
    ctx.pos++
  }
  return identifier
}

function isQuote(char: string): boolean {
  return char === '"' || char === "'"
}

function readStringLiteral(content: string, ctx: { pos: number }): string {
  let value = ''
  while (true) {
    const char = content.charAt(ctx.pos)
    if (isQuote(char)) {
      ctx.pos++
      break
    }
    value += char
    ctx.pos++
  }
  return value
}

console.log(tokens)
