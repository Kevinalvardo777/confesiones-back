import { Module } from '@nestjs/common'
import { RankingService } from 'src/modules/ranking/application/services/ranking.service'
import { RankingRepository } from 'src/modules/ranking/infrastructure/repositories/ranking.repository'
import { RankingController } from 'src/modules/ranking/presentation/controllers/ranking.controller'

@Module({
  controllers: [RankingController],
  providers: [RankingService, RankingRepository],
  exports: [RankingService],
})
export class RankingModule {}
