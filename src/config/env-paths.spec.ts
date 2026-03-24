import { resolveAppEnvironment, resolveEnvFilePaths } from 'src/config/env-paths'

describe('env-paths', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.APP_ENV
    delete process.env.NODE_ENV
    delete process.env.npm_lifecycle_event
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('prefers APP_ENV when present', () => {
    process.env.APP_ENV = 'dev'
    process.env.NODE_ENV = 'production'

    expect(resolveAppEnvironment()).toBe('dev')
  })

  it('maps NODE_ENV=production to prod', () => {
    process.env.NODE_ENV = 'production'
    expect(resolveAppEnvironment()).toBe('prod')
  })

  it('reads environment suffix from npm script name', () => {
    process.env.npm_lifecycle_event = 'start:cert'
    expect(resolveAppEnvironment()).toBe('cert')
  })

  it('falls back to local', () => {
    expect(resolveAppEnvironment()).toBe('local')
  })

  it('builds environment file priority list', () => {
    process.env.APP_ENV = 'dev'
    expect(resolveEnvFilePaths()).toEqual(['.env.dev.local', '.env.dev', '.env.local', '.env'])
  })
})
