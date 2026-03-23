import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/database/prisma/prisma.module'
import { RedisModule } from 'src/database/redis/redis.module'
import { HealthService } from 'src/modules/health/application/services/health.service'
import { HealthController } from 'src/modules/health/presentation/controllers/health.controller'

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
