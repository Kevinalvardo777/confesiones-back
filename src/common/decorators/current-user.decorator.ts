import { createParamDecorator } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserData | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: CurrentUserData }>()
    return request.user
  },
)
