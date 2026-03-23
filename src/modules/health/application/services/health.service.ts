import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma/prisma.service'
import { RedisService } from 'src/database/redis/redis.service'

type DependencyStatus = 'up' | 'down'

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async check() {
    const checks = await Promise.allSettled([
      this.prismaService.$queryRaw`SELECT 1`,
      this.redisService.getClient().ping(),
    ])

    const databaseStatus = checks[0].status === 'fulfilled' ? 'up' : 'down'
    const redisStatus = checks[1].status === 'fulfilled' ? 'up' : 'down'

    return {
      status: databaseStatus === 'up' && redisStatus === 'up' ? 'ok' : 'degraded',
      checks: this.buildChecks(databaseStatus, redisStatus),
      timestamp: new Date().toISOString(),
    }
  }

  async isReady() {
    const result = await this.check()
    return result.status === 'ok'
  }

  private buildChecks(database: DependencyStatus, redis: DependencyStatus) {
    return {
      database,
      redis,
    }
  }
}
