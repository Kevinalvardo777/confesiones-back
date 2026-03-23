import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { wrapResponse } from 'src/common/utils/response.util'
import { CommunitiesService } from 'src/modules/sections/application/services/sections.service'

@ApiTags('Communities')
@Controller({ path: 'communities', version: '1' })
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Public()
  @Get()
  async list() {
    return wrapResponse(await this.communitiesService.list())
  }

  @Public()
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return wrapResponse(await this.communitiesService.getBySlug(slug))
  }
}
