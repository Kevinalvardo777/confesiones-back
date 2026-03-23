import { Injectable } from '@nestjs/common'
import { ReportsService } from 'src/modules/reports/application/services/reports.service'

@Injectable()
export class ModerationService {
  constructor(private readonly reportsService: ReportsService) {}

  listQueue() {
    return this.reportsService.list()
  }
}
