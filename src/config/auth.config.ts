import { registerAs } from '@nestjs/config'
import { readRequiredSecret } from 'src/config/env.utils'

export default registerAs('auth', () => ({
  jwt: {
    accessSecret: readRequiredSecret('JWT_ACCESS_SECRET', 'access_secret'),
    refreshSecret: readRequiredSecret('JWT_REFRESH_SECRET', 'refresh_secret'),
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '30d',
  },
  cookies: {
    refreshTokenName: process.env.AUTH_REFRESH_COOKIE_NAME ?? 'confesiones_ec_refresh',
    secure:
      process.env.AUTH_COOKIE_SECURE === 'true' ||
      (process.env.NODE_ENV ?? 'development') === 'production',
    sameSite: process.env.AUTH_COOKIE_SAME_SITE ?? 'lax',
    domain: process.env.AUTH_COOKIE_DOMAIN,
  },
  argon2: {
    memoryCost: Number(process.env.ARGON2_MEMORY_COST ?? 19456),
    timeCost: Number(process.env.ARGON2_TIME_COST ?? 2),
    parallelism: Number(process.env.ARGON2_PARALLELISM ?? 1),
  },
}))
