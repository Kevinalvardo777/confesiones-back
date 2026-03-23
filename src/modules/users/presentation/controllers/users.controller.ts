import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { wrapResponse } from 'src/common/utils/response.util'
import { UsersService } from 'src/modules/users/application/services/users.service'
import { UpdateProfileDto } from 'src/modules/users/presentation/dto/update-profile.dto'

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() currentUser: CurrentUserData) {
    return wrapResponse(await this.usersService.getMe(currentUser))
  }

  @Patch('me')
  async updateMe(@CurrentUser() currentUser: CurrentUserData, @Body() dto: UpdateProfileDto) {
    return wrapResponse(
      await this.usersService.updateMe(currentUser, dto),
      undefined,
      'Profile updated',
    )
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return wrapResponse(await this.usersService.getById(id))
  }
}
