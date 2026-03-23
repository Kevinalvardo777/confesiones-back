import { Injectable } from '@nestjs/common'
import { CommentStatus, ConfessionStatus, Prisma } from '@prisma/client'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class ConfessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ConfessionUncheckedCreateInput) {
    return this.prisma.confession.create({
      data,
      include: { community: true },
    })
  }

  findById(id: string) {
    return this.prisma.confession.findUnique({
      where: { id },
      include: { community: true },
    })
  }

  async list(filters: {
    communityId?: string
    createdAt?: string
    sort?: 'recent' | 'top'
    skip: number
    take: number
  }) {
    const where: Prisma.ConfessionWhereInput = {
      deletedAt: null,
      status: { in: [ConfessionStatus.ACTIVE, ConfessionStatus.REPORTED, ConfessionStatus.HIDDEN] },
      ...(filters.communityId ? { communityId: filters.communityId } : {}),
      ...(filters.createdAt ? { createdAt: { gte: new Date(filters.createdAt) } } : {}),
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.confession.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy:
          filters.sort === 'top'
            ? [{ averageRating: 'desc' }, { ratingsCount: 'desc' }, { createdAt: 'desc' }]
            : [{ createdAt: 'desc' }],
        include: { community: true },
      }),
      this.prisma.confession.count({ where }),
    ])

    return { items, total }
  }

  incrementViews(id: string) {
    return this.prisma.confession.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
      include: { community: true },
    })
  }

  async upsertRating(confessionId: string, userId: string, stars: number) {
    await this.prisma.confessionRating.upsert({
      where: { confessionId_userId: { confessionId, userId } },
      create: { confessionId, userId, stars },
      update: { stars },
    })

    const aggregate = await this.prisma.confessionRating.aggregate({
      where: { confessionId },
      _avg: { stars: true },
      _count: { _all: true },
    })

    return this.prisma.confession.update({
      where: { id: confessionId },
      data: {
        averageRating: aggregate._avg.stars ?? 0,
        ratingsCount: aggregate._count._all,
      },
      include: { community: true },
    })
  }

  async refreshCommentsCount(confessionId: string) {
    const total = await this.prisma.comment.count({
      where: { confessionId, deletedAt: null, status: { not: CommentStatus.DELETED } },
    })

    return this.prisma.confession.update({
      where: { id: confessionId },
      data: { commentsCount: total },
    })
  }

  hide(id: string, notes?: string) {
    return this.prisma.confession.update({
      where: { id },
      data: { status: ConfessionStatus.HIDDEN, moderationNotes: notes },
    })
  }

  softDelete(id: string) {
    return this.prisma.confession.update({
      where: { id },
      data: { status: ConfessionStatus.DELETED, deletedAt: new Date() },
    })
  }
}
