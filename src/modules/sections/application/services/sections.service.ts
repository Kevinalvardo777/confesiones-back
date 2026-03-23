import { Injectable, NotFoundException } from '@nestjs/common'
import { CommunitiesRepository } from 'src/modules/sections/infrastructure/repositories/sections.repository'

@Injectable()
export class CommunitiesService {
  constructor(private readonly communitiesRepository: CommunitiesRepository) {}

  async list() {
    const communities = await this.communitiesRepository.listActive()
    return communities.map((community) => this.toDto(community))
  }

  async getBySlug(slug: string) {
    const community = await this.communitiesRepository.findBySlug(slug)
    if (!community) {
      throw new NotFoundException('Community not found')
    }

    return this.toDto(community)
  }

  async listForAdmin() {
    const communities = await this.communitiesRepository.listAll()
    return communities.map((community) => this.toDto(community))
  }

  private toDto(community: {
    id: string
    slug: string
    name: string
    city: string
    accentColor: string
    description: string
    headline: string
    isActive: boolean
    _count: { confessions: number }
  }) {
    return {
      id: community.id,
      slug: community.slug,
      name: community.name,
      city: community.city,
      accent: community.accentColor,
      headline: community.headline,
      description: community.description,
      isActive: community.isActive,
      confessionsCount: community._count.confessions,
    }
  }
}
