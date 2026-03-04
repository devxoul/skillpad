import { describe, expect, it } from 'bun:test'
import { getBunDownloadUrl, getBunSha256Url, PINNED_BUN_VERSION } from './runtime-config'

describe('runtime-config', () => {
  describe('PINNED_BUN_VERSION', () => {
    it('should be a valid version string', () => {
      expect(PINNED_BUN_VERSION).toBe('1.2.10')
    })
  })

  describe('getBunDownloadUrl', () => {
    it('should return correct URL for macOS ARM64', () => {
      const url = getBunDownloadUrl('1.2.10', 'darwin', 'arm64')
      expect(url).toBe('https://github.com/oven-sh/bun/releases/download/bun-v1.2.10/bun-darwin-aarch64.zip')
    })

    it('should return correct URL for macOS x86_64', () => {
      const url = getBunDownloadUrl('1.2.10', 'darwin', 'x86_64')
      expect(url).toBe('https://github.com/oven-sh/bun/releases/download/bun-v1.2.10/bun-darwin-x64.zip')
    })

    it('should return correct URL for Windows x86_64', () => {
      const url = getBunDownloadUrl('1.2.10', 'win32', 'x86_64')
      expect(url).toBe('https://github.com/oven-sh/bun/releases/download/bun-v1.2.10/bun-windows-x64.zip')
    })

    it('should throw for unsupported Linux platform', () => {
      expect(() => getBunDownloadUrl('1.2.10', 'linux', 'x86_64')).toThrow()
    })

    it('should throw for unsupported architecture', () => {
      expect(() => getBunDownloadUrl('1.2.10', 'darwin', 'arm')).toThrow()
    })
  })

  describe('getBunSha256Url', () => {
    it('should return correct SHASUMS256.txt URL', () => {
      const url = getBunSha256Url('1.2.10')
      expect(url).toBe('https://github.com/oven-sh/bun/releases/download/bun-v1.2.10/SHASUMS256.txt')
    })
  })
})
