import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfessionStatus } from '@prisma/client'
import {
  ANONYMOUS_ALIAS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from 'src/common/constants/app.constants'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { wrapResponse } from 'src/common/utils/response.util'
import { ConfessionsRepository } from 'src/modules/confessions/infrastructure/repositories/confessions.repository'
import { CreateConfessionDto } from 'src/modules/confessions/presentation/dto/create-confession.dto'
import { ListConfessionsDto } from 'src/modules/confessions/presentation/dto/list-confessions.dto'

@Injectable()
export class ConfessionsService {
  constructor(private readonly confessionsRepository: ConfessionsRepository) {}

  async create(dto: CreateConfessionDto, currentUser: CurrentUserData) {
    const confession = await this.confessionsRepository.create({
      communityId: dto.communityId,
      authorId: currentUser.id,
      alias: dto.alias?.trim() || null,
      isAnonymous: !dto.alias?.trim(),
      content: dto.content.trim(),
      status: ConfessionStatus.ACTIVE,
      publishedAt: new Date(),
    })

    return this.toDto(confession)
  }

  async list(query: ListConfessionsDto) {
    const page = query.page ?? DEFAULT_PAGE
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE

    const result = await this.confessionsRepository.list({
      communityId: query.communityId,
      createdAt: query.createdAt,
      sort: query.sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return wrapResponse(
      result.items.map((item) => this.toDto(item)),
      {
        page,
        pageSize,
        total: result.total,
      },
    )
  }

  async detail(id: string) {
    const confession = await this.confessionsRepository.findById(id)
    if (!confession || confession.deletedAt) {
      throw new NotFoundException('Confession not found')
    }

    const updated = await this.confessionsRepository.incrementViews(id)
    return this.toDto(updated)
  }

  async vote(id: string, stars: number, currentUser: CurrentUserData) {
    const confession = await this.confessionsRepository.findById(id)
    if (!confession || confession.deletedAt) {
      throw new NotFoundException('Confession not found')
    }

    const updated = await this.confessionsRepository.upsertRating(id, currentUser.id, stars)
    return this.toDto(updated)
  }

  async hide(id: string, notes?: string) {
    const updated = await this.confessionsRepository.hide(id, notes)
    return this.toDto(updated)
  }

  async remove(id: string) {
    await this.confessionsRepository.softDelete(id)
    return { deleted: true }
  }

  private toDto(confession: {
    id: string
    communityId: string
    alias: string | null
    isAnonymous: boolean
    content: string
    createdAt: Date
    averageRating: number | string | { toString(): string }
    ratingsCount: number
    commentsCount: number
    mediaMetadata: unknown
    status: ConfessionStatus
  }) {
    const mediaMetadata =
      confession.mediaMetadata && typeof confession.mediaMetadata === 'object'
        ? (confession.mediaMetadata as Record<string, unknown>)
        : null

    return {
      id: confession.id,
      communityId: confession.communityId,
      alias: confession.isAnonymous ? ANONYMOUS_ALIAS : (confession.alias ?? ANONYMOUS_ALIAS),
      content: confession.content,
      createdAt: confession.createdAt.toISOString(),
      averageRating: Number(confession.averageRating),
      ratingVotes: confession.ratingsCount,
      commentsCount: confession.commentsCount,
      imageUrl:
        mediaMetadata && typeof mediaMetadata.imageUrl === 'string'
          ? mediaMetadata.imageUrl
          : undefined,
      status:
        confession.status === ConfessionStatus.ACTIVE
          ? 'published'
          : confession.status === ConfessionStatus.HIDDEN
            ? 'hidden'
            : 'reported',
    }
  }
}
