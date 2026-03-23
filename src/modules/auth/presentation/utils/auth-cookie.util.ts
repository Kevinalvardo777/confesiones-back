import type { Response } from 'express'

export interface RefreshCookieConfig {
  name: string
  secure: boolean
  sameSite: string
  domain?: string
}

function buildCookieOptions(config: RefreshCookieConfig, maxAge: number) {
  return {
    httpOnly: true,
    secure: config.secure,
    sameSite: config.sameSite as 'lax' | 'strict' | 'none',
    domain: config.domain,
    path: '/',
    maxAge,
  }
}

export function setRefreshTokenCookie(
  response: Response,
  config: RefreshCookieConfig,
  refreshToken: string,
  maxAge: number,
) {
  response.cookie(config.name, refreshToken, buildCookieOptions(config, maxAge))
}

export function clearRefreshTokenCookie(response: Response, config: RefreshCookieConfig) {
  response.clearCookie(config.name, {
    httpOnly: true,
    secure: config.secure,
    sameSite: config.sameSite as 'lax' | 'strict' | 'none',
    domain: config.domain,
    path: '/',
  })
}

export function parseRefreshTokenCookie(
  cookieHeader: string | undefined,
  cookieName: string,
): string | null {
  if (!cookieHeader) {
    return null
  }

  for (const segment of cookieHeader.split(';')) {
    const [key, ...valueParts] = segment.trim().split('=')
    if (key === cookieName) {
      return decodeURIComponent(valueParts.join('='))
    }
  }

  return null
}
