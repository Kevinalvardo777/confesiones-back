import { registerAs } from '@nestjs/config'
import { parseCsvEnv } from 'src/config/env.utils'

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiVersion: process.env.API_VERSION ?? '1',
  appName: process.env.APP_NAME ?? 'Confesiones EC API',
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  corsOrigins: parseCsvEnv(process.env.CORS_ORIGINS, [
    process.env.FRONTEND_URL ?? 'http://localhost:5173',
  ]),
  trustProxy: process.env.TRUST_PROXY === 'true',
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
  maxPayloadSize: process.env.MAX_PAYLOAD_SIZE ?? '1mb',
  logLevel: process.env.LOG_LEVEL ?? 'info',
}))
