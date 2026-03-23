import type { RoleEnum } from 'src/common/enums/role.enum'

export interface UserEntity {
  id: string
  email: string
  displayName: string
  role: RoleEnum
  isGuest: boolean
  status: string
  createdAt: Date
  updatedAt: Date
}
