import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { Public } from 'src/common/decorators/public.decorator'
import { HealthService } from 'src/modules/health/application/services/health.service'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  async check() {
    return this.healthService.check()
  }

  @Public()
  @Get('ready')
  async ready() {
    const health = await this.healthService.check()

    if (health.status !== 'ok') {
      throw new ServiceUnavailableException({
        ...health,
        message: 'Dependencies are not ready',
      })
    }

    return health
  }
}
