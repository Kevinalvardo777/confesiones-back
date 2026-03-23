import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { wrapResponse } from 'src/common/utils/response.util'
import { RankingService } from 'src/modules/ranking/application/services/ranking.service'

@ApiTags('Ranking')
@Controller({ path: 'ranking', version: '1' })
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Public()
  @Get()
  async list(
    @Query('scope') scope?: string,
    @Query('communityId') communityId?: string,
    @Query('sectionId') sectionId?: string,
  ) {
    const normalizedScope = scope === 'section' ? 'community' : scope
    const resolvedCommunityId = communityId ?? sectionId
    const data =
      normalizedScope === 'community' && resolvedCommunityId
        ? await this.rankingService.byCommunity(resolvedCommunityId)
        : await this.rankingService.global()

    return wrapResponse(data)
  }

  @Public()
  @Get('global')
  async global() {
    return wrapResponse(await this.rankingService.global())
  }

  @Public()
  @Get('communities/:slug')
  async byCommunity(@Param('slug') slug: string) {
    return wrapResponse(await this.rankingService.byCommunity(slug))
  }
}
