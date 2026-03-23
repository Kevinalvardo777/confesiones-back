import { Injectable, NotFoundException } from '@nestjs/common'
import { CategoriesRepository } from 'src/modules/categories/infrastructure/repositories/categories.repository'

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async list() {
    const categories = await this.categoriesRepository.listActive()

    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      accent: category.accentColor,
      communitiesCount: category.communities.length,
      confessionsCount: category.communities.reduce(
        (sum, community) => sum + community._count.confessions,
        0,
      ),
      featuredCommunities: category.communities.slice(0, 3).map((community) => ({
        id: community.id,
        slug: community.slug,
        name: community.name,
        city: community.city,
      })),
    }))
  }

  async communitiesBySlug(slug: string) {
    const category = await this.categoriesRepository.findBySlug(slug)

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return {
      category: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        accent: category.accentColor,
      },
      communities: category.communities.map((community) => ({
        id: community.id,
        slug: community.slug,
        name: community.name,
        city: community.city,
        accent: community.accentColor,
        headline: community.headline,
        description: community.description,
        isActive: community.isActive,
        confessionsCount: community._count.confessions,
      })),
    }
  }
}
