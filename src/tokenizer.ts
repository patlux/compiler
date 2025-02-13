const KEYWORDS = ['function', 'const', 'let'] as const
type Keyword = (typeof KEYWORDS)[number]

type Token =
  | { type: 'LeftCurly' } // {
  | { type: 'RightCurly' } // }
  | { type: 'LeftParen' } // (
  | { type: 'RightParen' } // )
  | { type: 'dot' } // .
  | { type: 'operator'; value: string } // =
  | { type: 'identifier'; value: string }
  | { type: 'string'; value: string }
  | { type: 'keyword'; value: Keyword } // function, const, ...

export const tokenize = (content: string) => {
  const tokens: Token[] = []

  const ctx = { pos: 0 }

  while (ctx.pos < content.length) {
    const char = content.charAt(ctx.pos)
    // console.log({ char })

    let token = undefined
    if ((token = isSingle(char)) != null) {
      tokens.push(token)
      ctx.pos++
      continue
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

  return tokens
}

function isSingle(char: string): Token | null {
  switch (char) {
    case '.':
      return { type: 'dot' }
    case '{':
      return { type: 'LeftCurly' }
    case '}':
      return { type: 'RightCurly' }
    case '(':
      return { type: 'LeftParen' }
    case ')':
      return { type: 'RightParen' }
    case '=':
    case '+':
    case '-':
    case '/':
      return { type: 'operator', value: char }
  }
  return null
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
