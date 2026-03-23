import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from 'src/modules/auth/application/services/auth.service'
import { PasswordService } from 'src/modules/auth/application/services/password.service'
import { TokenService } from 'src/modules/auth/application/services/token.service'
import { JwtStrategy } from 'src/modules/auth/infrastructure/jwt.strategy'
import { RefreshTokenRepository } from 'src/modules/auth/infrastructure/repositories/refresh-token.repository'
import { AuthController } from 'src/modules/auth/presentation/controllers/auth.controller'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService, RefreshTokenRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
