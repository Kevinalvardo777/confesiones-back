import { ConfigService } from '@nestjs/config'
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { RoleName, UserStatus } from '@prisma/client'
import { RoleEnum } from 'src/common/enums/role.enum'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface'
import { UsersRepository } from 'src/modules/users/infrastructure/repositories/users.repository'
import { PasswordService } from 'src/modules/auth/application/services/password.service'
import { TokenService } from 'src/modules/auth/application/services/token.service'
import { RefreshTokenRepository } from 'src/modules/auth/infrastructure/repositories/refresh-token.repository'
import { RegisterDto } from 'src/modules/auth/presentation/dto/register.dto'
import { LoginDto } from 'src/modules/auth/presentation/dto/login.dto'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new ConflictException('Email already in use')
    }

    const defaultRole = await this.prisma.role.findUniqueOrThrow({
      where: { name: RoleName.USER },
    })

    const user = await this.usersRepository.create({
      email: dto.email,
      displayName: dto.name,
      passwordHash: await this.passwordService.hash(dto.password),
      roleId: defaultRole.id,
      status: UserStatus.ACTIVE,
    })

    return this.buildAuthResponse(user)
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findByEmail(dto.email)
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const validPassword = await this.passwordService.verify(user.passwordHash, dto.password)
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Account is not allowed to authenticate')
    }

    await this.usersRepository.update(user.id, { lastLoginAt: new Date() })

    return this.buildAuthResponse(user)
  }

  async guest() {
    const defaultRole = await this.prisma.role.findUniqueOrThrow({
      where: { name: RoleName.USER },
    })

    const timestamp = Date.now()
    const guest = await this.usersRepository.create({
      email: `guest-${timestamp}@guest.local`,
      displayName: `Invitado ${timestamp}`,
      passwordHash: null,
      roleId: defaultRole.id,
      isGuest: true,
      status: UserStatus.ACTIVE,
    })

    return this.buildAuthResponse(guest)
  }

  async me(currentUser: CurrentUserData) {
    const user = await this.usersRepository.findById(currentUser.id)
    if (!user) {
      throw new UnauthorizedException('Session user no longer exists')
    }

    return this.toPublicUser(user)
  }

  async refresh(rawRefreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(rawRefreshToken)
    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('Session not found')
    }

    const activeTokens = await this.refreshTokenRepository.findActiveByUserId(user.id)
    let matchedTokenId: string | null = null

    for (const storedToken of activeTokens) {
      if (await this.passwordService.verify(storedToken.tokenHash, rawRefreshToken)) {
        matchedTokenId = storedToken.id
        break
      }
    }

    if (!matchedTokenId) {
      throw new UnauthorizedException('Refresh token revoked or invalid')
    }

    await this.refreshTokenRepository.revokeById(matchedTokenId)

    return this.issueTokensForUser(user)
  }

  async logout(currentUser: CurrentUserData) {
    await this.refreshTokenRepository.revokeAllByUserId(currentUser.id)
    return { loggedOut: true }
  }

  private async buildAuthResponse(user: {
    id: string
    email: string
    displayName: string
    isGuest: boolean
    role: { name: string }
  }) {
    const session = await this.issueTokensForUser(user)
    return {
      user: this.toPublicUser(user),
      session,
    }
  }

  private async issueTokensForUser(user: {
    id: string
    email: string
    displayName: string
    isGuest: boolean
    role: { name: string }
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name as RoleEnum,
      isGuest: user.isGuest,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ])

    await this.refreshTokenRepository.create(
      user.id,
      await this.passwordService.hash(refreshToken),
      this.tokenService.getRefreshTokenExpiryDate(),
    )

    return {
      accessToken,
      refreshToken,
      expiresAt: this.tokenService.getAccessTokenExpiryDate().toISOString(),
      refreshExpiresAt: this.tokenService.getRefreshTokenExpiryDate().toISOString(),
    }
  }

  getRefreshTokenMaxAgeMs() {
    return this.tokenService.getRefreshTokenExpiryDate().getTime() - Date.now()
  }

  getRefreshCookieConfig() {
    return {
      name: this.configService.getOrThrow<string>('auth.cookies.refreshTokenName'),
      secure: this.configService.getOrThrow<boolean>('auth.cookies.secure'),
      sameSite: this.configService.getOrThrow<string>('auth.cookies.sameSite'),
      domain: this.configService.get<string>('auth.cookies.domain'),
    }
  }

  private toPublicUser(user: {
    id: string
    email: string
    displayName: string
    isGuest: boolean
    role: { name: string }
  }) {
    return {
      id: user.id,
      name: user.displayName,
      email: user.email,
      role: user.role.name.toLowerCase(),
      isGuest: user.isGuest,
    }
  }
}
