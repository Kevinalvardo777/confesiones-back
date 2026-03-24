import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const entries = {}

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    entries[key] = value
  }

  return entries
}

function fail(message) {
  console.error(`\n[validate-prod-env] ${message}`)
  process.exit(1)
}

const args = process.argv.slice(2)
const envFileArgIndex = args.findIndex((arg) => arg === '--env-file')
const envFile = envFileArgIndex >= 0 ? args[envFileArgIndex + 1] : '.env.prod'
const allowPlaceholders = args.includes('--allow-placeholders')
const filePath = resolve(process.cwd(), envFile)

if (!existsSync(filePath)) {
  fail(`File not found: ${filePath}`)
}

const env = parseEnvFile(filePath)

const required = [
  'NODE_ENV',
  'PORT',
  'APP_URL',
  'FRONTEND_URL',
  'CORS_ORIGINS',
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'TRUST_PROXY',
  'SWAGGER_ENABLED',
  'AUTH_COOKIE_SECURE',
]

for (const key of required) {
  if (!env[key]) {
    fail(`Missing required variable: ${key}`)
  }
}

if (env.NODE_ENV !== 'production') {
  fail('NODE_ENV must be production')
}

if (env.TRUST_PROXY !== 'true') {
  fail('TRUST_PROXY must be true in production')
}

if (env.SWAGGER_ENABLED !== 'false') {
  fail('SWAGGER_ENABLED must be false in production')
}

if (env.AUTH_COOKIE_SECURE !== 'true') {
  fail('AUTH_COOKIE_SECURE must be true in production')
}

if (!env.APP_URL.startsWith('https://')) {
  fail('APP_URL must use https')
}

if (!env.FRONTEND_URL.startsWith('https://')) {
  fail('FRONTEND_URL must use https')
}

if (!allowPlaceholders) {
  const forbiddenFragments = ['change_me', 'replace_with', 'localhost', 'postgres:postgres@']
  for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL', 'REDIS_URL']) {
    const value = env[key].toLowerCase()
    if (forbiddenFragments.some((fragment) => value.includes(fragment))) {
      fail(`Variable ${key} still looks insecure or local: ${env[key]}`)
    }
  }
}

console.log(`[validate-prod-env] OK: ${filePath}`)
