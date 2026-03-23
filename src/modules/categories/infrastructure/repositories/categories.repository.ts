import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.category.findMany({
      include: {
        communities: {
          where: { isActive: true, deletedAt: null },
          include: {
            _count: {
              select: { confessions: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: {
        communities: {
          where: { isActive: true, deletedAt: null },
          include: {
            _count: {
              select: { confessions: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
    })
  }
}
