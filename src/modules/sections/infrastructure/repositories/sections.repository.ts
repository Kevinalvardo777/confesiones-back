import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class CommunitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.community.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        _count: {
          select: { confessions: true },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  findBySlug(slug: string) {
    return this.prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { confessions: true },
        },
      },
    })
  }

  listAll() {
    return this.prisma.community.findMany({
      include: { _count: { select: { confessions: true } } },
      orderBy: { createdAt: 'asc' },
    })
  }
}
