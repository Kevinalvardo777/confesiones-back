import { Injectable } from '@nestjs/common'
import { ANONYMOUS_ALIAS } from 'src/common/constants/app.constants'
import { RankingRepository } from 'src/modules/ranking/infrastructure/repositories/ranking.repository'

@Injectable()
export class RankingService {
  constructor(private readonly rankingRepository: RankingRepository) {}

  async global() {
    const confessions = await this.rankingRepository.listGlobal()
    return confessions.map((confession) => this.toDto(confession))
  }

  async byCommunity(communityId: string) {
    const confessions = await this.rankingRepository.listByCommunity(communityId)
    return confessions.map((confession) => this.toDto(confession))
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
  }) {
    return {
      id: confession.id,
      communityId: confession.communityId,
      alias: confession.isAnonymous ? ANONYMOUS_ALIAS : (confession.alias ?? ANONYMOUS_ALIAS),
      content: confession.content,
      createdAt: confession.createdAt.toISOString(),
      averageRating: Number(confession.averageRating),
      ratingVotes: confession.ratingsCount,
      commentsCount: confession.commentsCount,
      status: 'published',
    }
  }
}
