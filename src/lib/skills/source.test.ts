import { describe, expect, it } from 'bun:test'

import { parseSource } from './source'

describe('parseSource', () => {
  it('parses direct URL sources', () => {
    expect(parseSource('https://cli.sentry.dev/')).toEqual({
      type: 'url',
      url: 'https://cli.sentry.dev',
    })
  })

  it('parses scheme-less domain sources as https URLs', () => {
    expect(parseSource('cli.sentry.dev')).toEqual({
      type: 'url',
      url: 'https://cli.sentry.dev',
    })
  })

  it('parses GitHub URLs as GitHub sources', () => {
    expect(parseSource('https://github.com/xoul/skills')).toEqual({
      type: 'github',
      owner: 'xoul',
      repo: 'skills',
      ref: 'main',
      skillFilter: undefined,
    })
  })
})
