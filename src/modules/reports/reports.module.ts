import { Module } from '@nestjs/common'
import { CommentsModule } from 'src/modules/comments/comments.module'
import { ConfessionsModule } from 'src/modules/confessions/confessions.module'
import { ReportsService } from 'src/modules/reports/application/services/reports.service'
import { ReportsRepository } from 'src/modules/reports/infrastructure/repositories/reports.repository'
import { ReportsController } from 'src/modules/reports/presentation/controllers/reports.controller'

@Module({
  imports: [ConfessionsModule, CommentsModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
  exports: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
