export interface ConfessionEntity {
  id: string
  slug: string
  communityId: string
  alias: string
  content: string
  createdAt: string
  averageRating: number
  ratingVotes: number
  commentsCount: number
  imageUrl?: string
  status: 'published' | 'hidden' | 'reported'
}
