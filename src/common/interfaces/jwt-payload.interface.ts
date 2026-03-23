import type { RoleEnum } from 'src/common/enums/role.enum'

export interface JwtPayload {
  sub: string
  email: string
  role: RoleEnum
  isGuest: boolean
}
