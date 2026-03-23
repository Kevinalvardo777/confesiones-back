export interface CommentEntity {
  id: string
  confessionId: string
  parentId: string | null
  authorName: string
  content: string
  createdAt: string
}
