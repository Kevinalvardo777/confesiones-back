import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis

  constructor(configService: ConfigService) {
    this.client = new Redis(configService.getOrThrow<string>('redis.redisUrl'), {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    })
  }

  getClient(): Redis {
    return this.client
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit()
  }
}
