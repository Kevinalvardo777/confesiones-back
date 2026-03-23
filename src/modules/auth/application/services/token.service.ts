import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface'

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('auth.jwt.accessSecret'),
      expiresIn: this.parseDurationToSeconds(
        this.configService.getOrThrow<string>('auth.jwt.accessTtl'),
      ),
    })
  }

  async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('auth.jwt.refreshSecret'),
      expiresIn: this.parseDurationToSeconds(
        this.configService.getOrThrow<string>('auth.jwt.refreshTtl'),
      ),
    })
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.getOrThrow<string>('auth.jwt.refreshSecret'),
    })
  }

  getRefreshTokenExpiryDate() {
    const ttl = this.configService.getOrThrow<string>('auth.jwt.refreshTtl')
    const days = Number(ttl.replace('d', ''))
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  }

  getAccessTokenExpiryDate() {
    const ttl = this.configService.getOrThrow<string>('auth.jwt.accessTtl')
    const minutes = Number(ttl.replace('m', ''))
    return new Date(Date.now() + minutes * 60 * 1000)
  }

  private parseDurationToSeconds(ttl: string): number {
    if (ttl.endsWith('m')) {
      return Number(ttl.replace('m', '')) * 60
    }

    if (ttl.endsWith('d')) {
      return Number(ttl.replace('d', '')) * 24 * 60 * 60
    }

    if (ttl.endsWith('h')) {
      return Number(ttl.replace('h', '')) * 60 * 60
    }

    return Number(ttl)
  }
}
