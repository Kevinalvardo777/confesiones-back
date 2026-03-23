import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma/prisma.service'
import { ReportsService } from 'src/modules/reports/application/services/reports.service'
import { CommunitiesService } from 'src/modules/sections/application/services/sections.service'
import { UsersService } from 'src/modules/users/application/services/users.service'

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly communitiesService: CommunitiesService,
    private readonly usersService: UsersService,
    private readonly reportsService: ReportsService,
  ) {}

  async getMetrics() {
    const [users, confessions, comments, reports] = await this.prisma.$transaction([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.confession.count({ where: { deletedAt: null } }),
      this.prisma.comment.count({ where: { deletedAt: null } }),
      this.prisma.report.count(),
    ])

    return { users, confessions, comments, reports }
  }

  listUsers() {
    return this.usersService.listForAdmin()
  }

  listCommunities() {
    return this.communitiesService.listForAdmin()
  }

  listReports() {
    return this.reportsService.list()
  }

  async listConfessions() {
    const confessions = await this.prisma.confession.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return confessions.map((confession) => ({
      id: confession.id,
      communityId: confession.communityId,
      status: confession.status,
      averageRating: Number(confession.averageRating),
      ratingsCount: confession.ratingsCount,
      commentsCount: confession.commentsCount,
      createdAt: confession.createdAt.toISOString(),
    }))
  }

  async listComments() {
    const comments = await this.prisma.comment.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return comments.map((comment) => ({
      id: comment.id,
      confessionId: comment.confessionId,
      parentId: comment.parentId,
      status: comment.status,
      createdAt: comment.createdAt.toISOString(),
    }))
  }
}
