const insecureSecretValues = new Set([
  '',
  'access_secret',
  'refresh_secret',
  'change_me_access_secret',
  'change_me_refresh_secret',
])

export function readRequiredSecret(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  const nodeEnv = process.env.NODE_ENV ?? 'development'

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  if (nodeEnv === 'production' && insecureSecretValues.has(value)) {
    throw new Error(`Environment variable ${name} must be set to a strong secret in production`)
  }

  return value
}

export function parseCsvEnv(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
