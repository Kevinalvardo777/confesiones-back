import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RoleEnum } from 'src/common/enums/role.enum'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('auth.jwt.accessSecret'),
    })
  }

  validate(payload: JwtPayload): CurrentUserData {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role ?? RoleEnum.USER,
      isGuest: payload.isGuest,
    }
  }
}
