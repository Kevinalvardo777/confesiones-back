import { Injectable } from '@nestjs/common'
import { ConfessionStatus } from '@prisma/client'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class RankingRepository {
  constructor(private readonly prisma: PrismaService) {}

  listGlobal() {
    return this.prisma.confession.findMany({
      where: { deletedAt: null, status: ConfessionStatus.ACTIVE },
      orderBy: [{ averageRating: 'desc' }, { ratingsCount: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    })
  }

  listByCommunity(communityId: string) {
    return this.prisma.confession.findMany({
      where: {
        communityId,
        deletedAt: null,
        status: ConfessionStatus.ACTIVE,
      },
      orderBy: [{ averageRating: 'desc' }, { ratingsCount: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    })
  }
}
