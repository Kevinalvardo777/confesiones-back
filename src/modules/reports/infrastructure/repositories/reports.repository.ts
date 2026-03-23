import { Injectable } from '@nestjs/common'
import { ModerationActionType, ReportStatus, ReportTargetType } from '@prisma/client'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: {
    reporterId?: string
    targetType: 'confession' | 'comment'
    targetId: string
    reason: string
    details?: string
  }) {
    return this.prisma.report.create({
      data: {
        reporterId: payload.reporterId,
        targetType:
          payload.targetType === 'confession'
            ? ReportTargetType.CONFESSION
            : ReportTargetType.COMMENT,
        targetId: payload.targetId,
        confessionId: payload.targetType === 'confession' ? payload.targetId : null,
        commentId: payload.targetType === 'comment' ? payload.targetId : null,
        reason: payload.reason,
        details: payload.details,
      },
    })
  }

  list() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  findById(id: string) {
    return this.prisma.report.findUnique({ where: { id } })
  }

  async review(payload: {
    reportId: string
    moderatorId: string
    status: ReportStatus
    resolutionNotes?: string
    createHideAction?: boolean
  }) {
    const report = await this.prisma.report.update({
      where: { id: payload.reportId },
      data: {
        status: payload.status,
        reviewedById: payload.moderatorId,
        reviewedAt: new Date(),
        resolutionNotes: payload.resolutionNotes,
      },
    })

    if (payload.createHideAction) {
      await this.prisma.moderationAction.create({
        data: {
          reportId: report.id,
          confessionId: report.confessionId,
          commentId: report.commentId,
          moderatorId: payload.moderatorId,
          actionType: ModerationActionType.HIDE_CONTENT,
          reason: report.reason,
          notes: payload.resolutionNotes,
        },
      })
    }

    return report
  }
}
