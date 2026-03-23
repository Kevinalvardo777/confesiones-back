import { Injectable } from '@nestjs/common'
import { CommentStatus, Prisma } from '@prisma/client'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  listByConfession(confessionId: string) {
    return this.prisma.comment.findMany({
      where: {
        confessionId,
        deletedAt: null,
        status: { in: [CommentStatus.ACTIVE, CommentStatus.REPORTED, CommentStatus.HIDDEN] },
      },
      orderBy: [{ createdAt: 'asc' }],
    })
  }

  create(data: Prisma.CommentUncheckedCreateInput) {
    return this.prisma.comment.create({ data })
  }

  findById(id: string) {
    return this.prisma.comment.findUnique({ where: { id } })
  }

  hide(id: string, notes?: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: CommentStatus.HIDDEN, moderationNotes: notes },
    })
  }
}
