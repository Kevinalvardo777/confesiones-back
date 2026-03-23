import { Module } from '@nestjs/common'
import { ConfessionsService } from 'src/modules/confessions/application/services/confessions.service'
import { ConfessionsRepository } from 'src/modules/confessions/infrastructure/repositories/confessions.repository'
import { ConfessionsController } from 'src/modules/confessions/presentation/controllers/confessions.controller'

@Module({
  controllers: [ConfessionsController],
  providers: [ConfessionsService, ConfessionsRepository],
  exports: [ConfessionsService, ConfessionsRepository],
})
export class ConfessionsModule {}
