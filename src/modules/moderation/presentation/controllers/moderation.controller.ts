import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/common/enums/role.enum'
import { wrapResponse } from 'src/common/utils/response.util'
import { ModerationService } from 'src/modules/moderation/application/services/moderation.service'

@ApiTags('Moderation')
@ApiBearerAuth()
@Roles(RoleEnum.MODERATOR, RoleEnum.ADMIN)
@Controller({ path: 'moderation', version: '1' })
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('queue')
  async queue() {
    return wrapResponse(await this.moderationService.listQueue())
  }
}
