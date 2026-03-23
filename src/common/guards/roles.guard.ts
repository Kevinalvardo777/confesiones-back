import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/common/decorators/roles.decorator'
import type { RoleEnum } from 'src/common/enums/role.enum'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest<{ user?: CurrentUserData }>()

    if (!request.user) {
      throw new UnauthorizedException('Authentication required')
    }

    if (!requiredRoles.includes(request.user.role)) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}
