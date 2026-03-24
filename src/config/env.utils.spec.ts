import { parseCsvEnv, readRequiredSecret } from 'src/config/env.utils'

describe('env.utils', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('readRequiredSecret', () => {
    it('returns configured secret value', () => {
      process.env.JWT_ACCESS_SECRET = 'strong-secret'
      expect(readRequiredSecret('JWT_ACCESS_SECRET')).toBe('strong-secret')
    })

    it('uses fallback when env var is missing', () => {
      delete process.env.JWT_ACCESS_SECRET
      expect(readRequiredSecret('JWT_ACCESS_SECRET', 'fallback')).toBe('fallback')
    })

    it('throws when value is missing', () => {
      delete process.env.JWT_ACCESS_SECRET
      expect(() => readRequiredSecret('JWT_ACCESS_SECRET')).toThrow(
        'Missing required environment variable: JWT_ACCESS_SECRET',
      )
    })

    it('rejects insecure defaults in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_ACCESS_SECRET = 'change_me_access_secret'

      expect(() => readRequiredSecret('JWT_ACCESS_SECRET')).toThrow(
        'Environment variable JWT_ACCESS_SECRET must be set to a strong secret in production',
      )
    })
  })

  describe('parseCsvEnv', () => {
    it('returns fallback when value is undefined', () => {
      expect(parseCsvEnv(undefined, ['http://localhost:5173'])).toEqual(['http://localhost:5173'])
    })

    it('parses and trims CSV values', () => {
      expect(parseCsvEnv(' https://a.com, https://b.com ,,', [])).toEqual([
        'https://a.com',
        'https://b.com',
      ])
    })
  })
})
