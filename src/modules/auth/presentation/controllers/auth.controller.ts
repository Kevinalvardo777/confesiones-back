import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UnauthorizedException } from '@nestjs/common'
import type { Response } from 'express'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { wrapResponse } from 'src/common/utils/response.util'
import { AuthService } from 'src/modules/auth/application/services/auth.service'
import { LoginDto } from 'src/modules/auth/presentation/dto/login.dto'
import { RefreshTokenDto } from 'src/modules/auth/presentation/dto/refresh-token.dto'
import { RegisterDto } from 'src/modules/auth/presentation/dto/register.dto'
import {
  clearRefreshTokenCookie,
  parseRefreshTokenCookie,
  setRefreshTokenCookie,
} from 'src/modules/auth/presentation/utils/auth-cookie.util'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const authResponse = await this.authService.register(dto)
    this.attachRefreshCookie(response, authResponse.session.refreshToken)
    return wrapResponse(this.stripRefreshToken(authResponse), undefined, 'User registered')
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const authResponse = await this.authService.login(dto)
    this.attachRefreshCookie(response, authResponse.session.refreshToken)
    return wrapResponse(this.stripRefreshToken(authResponse), undefined, 'Login successful')
  }

  @Public()
  @Post('guest')
  async guest(@Res({ passthrough: true }) response: Response) {
    const authResponse = await this.authService.guest()
    this.attachRefreshCookie(response, authResponse.session.refreshToken)
    return wrapResponse(this.stripRefreshToken(authResponse), undefined, 'Guest session created')
  }

  @ApiBearerAuth()
  @Get('me')
  async me(@CurrentUser() currentUser: CurrentUserData) {
    return wrapResponse(await this.authService.me(currentUser))
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Headers('cookie') cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookieConfig = this.authService.getRefreshCookieConfig()
    const refreshToken =
      dto.refreshToken || parseRefreshTokenCookie(cookieHeader, cookieConfig.name)

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing')
    }

    const session = await this.authService.refresh(refreshToken)
    this.attachRefreshCookie(response, session.refreshToken)
    return wrapResponse(this.stripSessionRefreshToken(session), undefined, 'Session refreshed')
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @CurrentUser() currentUser: CurrentUserData,
    @Res({ passthrough: true }) response: Response,
  ) {
    clearRefreshTokenCookie(response, this.authService.getRefreshCookieConfig())
    return wrapResponse(await this.authService.logout(currentUser), undefined, 'Session closed')
  }

  private attachRefreshCookie(response: Response, refreshToken: string) {
    setRefreshTokenCookie(
      response,
      this.authService.getRefreshCookieConfig(),
      refreshToken,
      this.authService.getRefreshTokenMaxAgeMs(),
    )
  }

  private stripRefreshToken<T extends { session: { refreshToken: string } }>(response: T) {
    const { refreshToken, ...safeSession } = response.session
    void refreshToken
    return {
      ...response,
      session: safeSession,
    }
  }

  private stripSessionRefreshToken<T extends { refreshToken: string }>(session: T) {
    const { refreshToken, ...safeSession } = session
    void refreshToken
    return safeSession
  }
}
