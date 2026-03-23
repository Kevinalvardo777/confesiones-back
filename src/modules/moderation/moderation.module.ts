import { Module } from '@nestjs/common'
import { ReportsModule } from 'src/modules/reports/reports.module'
import { ModerationService } from 'src/modules/moderation/application/services/moderation.service'
import { ModerationController } from 'src/modules/moderation/presentation/controllers/moderation.controller'

@Module({
  imports: [ReportsModule],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
