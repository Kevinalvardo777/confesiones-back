const allowedEnvironments = ['local', 'dev', 'cert', 'prod'] as const

type AppEnvironment = (typeof allowedEnvironments)[number]

function getEnvironmentFromLifecycleEvent(
  eventName: string | undefined,
): AppEnvironment | undefined {
  if (!eventName) {
    return undefined
  }

  const matches = eventName.match(/:(local|dev|cert|prod)$/)
  return matches?.[1] as AppEnvironment | undefined
}

function normalizeEnvironment(value: string | undefined): AppEnvironment | undefined {
  if (!value) {
    return undefined
  }

  const normalized = value.toLowerCase()

  if (normalized === 'production') {
    return 'prod'
  }

  if ((allowedEnvironments as readonly string[]).includes(normalized)) {
    return normalized as AppEnvironment
  }

  return undefined
}

export function resolveAppEnvironment(): AppEnvironment {
  return (
    normalizeEnvironment(process.env.APP_ENV) ??
    getEnvironmentFromLifecycleEvent(process.env.npm_lifecycle_event) ??
    normalizeEnvironment(process.env.NODE_ENV) ??
    'local'
  )
}

export function resolveEnvFilePaths() {
  const environment = resolveAppEnvironment()

  return [`.env.${environment}.local`, `.env.${environment}`, '.env.local', '.env']
}
