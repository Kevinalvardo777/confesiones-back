import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  hash(value: string) {
    return argon2.hash(value, {
      memoryCost: this.configService.getOrThrow<number>('auth.argon2.memoryCost'),
      timeCost: this.configService.getOrThrow<number>('auth.argon2.timeCost'),
      parallelism: this.configService.getOrThrow<number>('auth.argon2.parallelism'),
      type: argon2.argon2id,
    })
  }

  verify(hash: string, value: string) {
    return argon2.verify(hash, value)
  }
}
