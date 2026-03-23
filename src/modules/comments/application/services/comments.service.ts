import { Injectable, NotFoundException } from '@nestjs/common'
import { CommentStatus } from '@prisma/client'
import { ANONYMOUS_ALIAS } from 'src/common/constants/app.constants'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { ConfessionsRepository } from 'src/modules/confessions/infrastructure/repositories/confessions.repository'
import { CommentsRepository } from 'src/modules/comments/infrastructure/repositories/comments.repository'
import { CreateCommentDto } from 'src/modules/comments/presentation/dto/create-comment.dto'

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly confessionsRepository: ConfessionsRepository,
  ) {}

  async list(confessionId: string) {
    const comments = await this.commentsRepository.listByConfession(confessionId)
    return comments.map((comment) => this.toDto(comment))
  }

  async create(dto: CreateCommentDto, currentUser: CurrentUserData) {
    const confession = await this.confessionsRepository.findById(dto.confessionId)
    if (!confession || confession.deletedAt) {
      throw new NotFoundException('Confession not found')
    }

    const created = await this.commentsRepository.create({
      confessionId: dto.confessionId,
      parentId: dto.parentId ?? null,
      authorId: currentUser.id,
      authorName: dto.authorName?.trim() || ANONYMOUS_ALIAS,
      content: dto.content.trim(),
      status: CommentStatus.ACTIVE,
    })

    await this.confessionsRepository.refreshCommentsCount(dto.confessionId)
    return this.toDto(created)
  }

  async reply(commentId: string, dto: CreateCommentDto, currentUser: CurrentUserData) {
    const parent = await this.commentsRepository.findById(commentId)
    if (!parent) {
      throw new NotFoundException('Parent comment not found')
    }

    return this.create(
      {
        ...dto,
        confessionId: parent.confessionId,
        parentId: parent.id,
      },
      currentUser,
    )
  }

  async hide(id: string, notes?: string) {
    const comment = await this.commentsRepository.hide(id, notes)
    return this.toDto(comment)
  }

  private toDto(comment: {
    id: string
    confessionId: string
    parentId: string | null
    authorName: string | null
    content: string
    createdAt: Date
  }) {
    return {
      id: comment.id,
      confessionId: comment.confessionId,
      parentId: comment.parentId,
      authorName: comment.authorName ?? ANONYMOUS_ALIAS,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    }
  }
}
