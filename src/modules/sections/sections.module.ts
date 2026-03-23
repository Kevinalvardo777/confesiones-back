import { Module } from '@nestjs/common'
import { CommunitiesService } from 'src/modules/sections/application/services/sections.service'
import { CommunitiesRepository } from 'src/modules/sections/infrastructure/repositories/sections.repository'
import { CommunitiesController } from 'src/modules/sections/presentation/controllers/sections.controller'

@Module({
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesRepository],
  exports: [CommunitiesService, CommunitiesRepository],
})
export class CommunitiesModule {}
