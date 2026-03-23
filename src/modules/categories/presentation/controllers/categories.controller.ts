import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { wrapResponse } from 'src/common/utils/response.util'
import { CategoriesService } from 'src/modules/categories/application/services/categories.service'

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async list() {
    return wrapResponse(await this.categoriesService.list())
  }

  @Public()
  @Get(':slug/communities')
  async communitiesBySlug(@Param('slug') slug: string) {
    return wrapResponse(await this.categoriesService.communitiesBySlug(slug))
  }
}
