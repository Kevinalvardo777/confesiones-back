import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { wrapResponse } from 'src/common/utils/response.util'
import { CommentsService } from 'src/modules/comments/application/services/comments.service'
import { CreateCommentDto } from 'src/modules/comments/presentation/dto/create-comment.dto'

@ApiTags('Comments')
@Controller({ path: 'comments', version: '1' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get()
  async list(@Query('confessionId') confessionId: string) {
    return wrapResponse(await this.commentsService.list(confessionId))
  }

  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateCommentDto, @CurrentUser() currentUser: CurrentUserData) {
    return wrapResponse(
      await this.commentsService.create(dto, currentUser),
      undefined,
      'Comment created',
    )
  }

  @ApiBearerAuth()
  @Post(':id/reply')
  async reply(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return wrapResponse(
      await this.commentsService.reply(id, dto, currentUser),
      undefined,
      'Reply created',
    )
  }
}
