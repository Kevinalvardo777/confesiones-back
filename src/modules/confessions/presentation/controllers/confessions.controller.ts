import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { wrapResponse } from 'src/common/utils/response.util'
import { ConfessionsService } from 'src/modules/confessions/application/services/confessions.service'
import { CreateConfessionDto } from 'src/modules/confessions/presentation/dto/create-confession.dto'
import { ListConfessionsDto } from 'src/modules/confessions/presentation/dto/list-confessions.dto'
import { RateConfessionDto } from 'src/modules/confessions/presentation/dto/rate-confession.dto'

@ApiTags('Confessions')
@Controller({ path: 'confessions', version: '1' })
export class ConfessionsController {
  constructor(private readonly confessionsService: ConfessionsService) {}

  @Public()
  @Get()
  async list(@Query() query: ListConfessionsDto) {
    return this.confessionsService.list(query)
  }

  @Public()
  @Get(':id')
  async detail(@Param('id') id: string) {
    return wrapResponse(await this.confessionsService.detail(id))
  }

  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateConfessionDto, @CurrentUser() currentUser: CurrentUserData) {
    return wrapResponse(
      await this.confessionsService.create(dto, currentUser),
      undefined,
      'Confession created',
    )
  }

  @ApiBearerAuth()
  @Post(':id/vote')
  async vote(
    @Param('id') id: string,
    @Body() dto: RateConfessionDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return wrapResponse(
      await this.confessionsService.vote(id, dto.stars, currentUser),
      undefined,
      'Vote registered',
    )
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return wrapResponse(await this.confessionsService.remove(id), undefined, 'Confession deleted')
  }
}
