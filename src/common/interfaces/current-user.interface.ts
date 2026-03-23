import type { RoleEnum } from 'src/common/enums/role.enum'

export interface CurrentUserData {
  id: string
  email: string
  role: RoleEnum
  isGuest: boolean
}
