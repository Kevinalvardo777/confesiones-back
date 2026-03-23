import { Injectable, NotFoundException } from '@nestjs/common'
import { ReportStatus } from '@prisma/client'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { CommentsService } from 'src/modules/comments/application/services/comments.service'
import { ConfessionsService } from 'src/modules/confessions/application/services/confessions.service'
import { ReportsRepository } from 'src/modules/reports/infrastructure/repositories/reports.repository'
import { CreateReportDto } from 'src/modules/reports/presentation/dto/create-report.dto'
import { ReviewReportDto } from 'src/modules/reports/presentation/dto/review-report.dto'

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly confessionsService: ConfessionsService,
    private readonly commentsService: CommentsService,
  ) {}

  async create(dto: CreateReportDto, currentUser?: CurrentUserData) {
    const report = await this.reportsRepository.create({
      reporterId: currentUser?.id,
      targetType: dto.targetType,
      targetId: dto.targetId,
      reason: dto.reason,
      details: dto.details,
    })

    return this.toDto(report)
  }

  async list() {
    const reports = await this.reportsRepository.list()
    return reports.map((report) => this.toDto(report))
  }

  async review(reportId: string, dto: ReviewReportDto, currentUser: CurrentUserData) {
    const existing = await this.reportsRepository.findById(reportId)
    if (!existing) {
      throw new NotFoundException('Report not found')
    }

    const nextStatus =
      dto.status === 'dismissed'
        ? ReportStatus.DISMISSED
        : dto.status === 'resolved'
          ? ReportStatus.RESOLVED
          : ReportStatus.IN_REVIEW

    if (dto.moderationAction === 'hide') {
      if (existing.confessionId) {
        await this.confessionsService.hide(existing.confessionId, dto.resolutionNotes)
      }

      if (existing.commentId) {
        await this.commentsService.hide(existing.commentId, dto.resolutionNotes)
      }
    }

    const report = await this.reportsRepository.review({
      reportId,
      moderatorId: currentUser.id,
      status: nextStatus,
      resolutionNotes: dto.resolutionNotes,
      createHideAction: dto.moderationAction === 'hide',
    })

    return this.toDto(report)
  }

  private toDto(report: {
    id: string
    targetType: 'CONFESSION' | 'COMMENT'
    targetId: string
    reason: string
    details: string | null
    createdAt: Date
    status: ReportStatus
  }) {
    return {
      id: report.id,
      targetType: report.targetType.toLowerCase(),
      targetId: report.targetId,
      reason: report.reason,
      details: report.details ?? '',
      createdAt: report.createdAt.toISOString(),
      status:
        report.status === ReportStatus.DISMISSED
          ? 'dismissed'
          : report.status === ReportStatus.RESOLVED || report.status === ReportStatus.IN_REVIEW
            ? 'reviewed'
            : 'open',
    }
  }
}
