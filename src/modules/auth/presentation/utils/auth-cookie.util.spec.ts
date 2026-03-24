import {
  clearRefreshTokenCookie,
  parseRefreshTokenCookie,
  setRefreshTokenCookie,
  type RefreshCookieConfig,
} from 'src/modules/auth/presentation/utils/auth-cookie.util'

describe('auth-cookie utils', () => {
  const config: RefreshCookieConfig = {
    name: 'refresh',
    secure: true,
    sameSite: 'lax',
    domain: 'example.com',
  }

  it('sets refresh cookie with secure httpOnly options', () => {
    const cookie = jest.fn()
    setRefreshTokenCookie({ cookie } as never, config, 'token-123', 1000)

    expect(cookie).toHaveBeenCalledWith(
      'refresh',
      'token-123',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        domain: 'example.com',
        path: '/',
        maxAge: 1000,
      }),
    )
  })

  it('clears refresh cookie using matching options', () => {
    const clearCookie = jest.fn()
    clearRefreshTokenCookie({ clearCookie } as never, config)

    expect(clearCookie).toHaveBeenCalledWith(
      'refresh',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        domain: 'example.com',
        path: '/',
      }),
    )
  })

  it('parses refresh token value from cookie header', () => {
    expect(parseRefreshTokenCookie('a=1; refresh=token-abc%3D; b=2', 'refresh')).toBe('token-abc=')
  })

  it('returns null when cookie does not exist', () => {
    expect(parseRefreshTokenCookie('a=1; b=2', 'refresh')).toBeNull()
  })
})
