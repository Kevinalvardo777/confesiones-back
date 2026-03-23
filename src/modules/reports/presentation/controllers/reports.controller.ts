import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/common/enums/role.enum'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { wrapResponse } from 'src/common/utils/response.util'
import { ReportsService } from 'src/modules/reports/application/services/reports.service'
import { CreateReportDto } from 'src/modules/reports/presentation/dto/create-report.dto'
import { ReviewReportDto } from 'src/modules/reports/presentation/dto/review-report.dto'

@ApiTags('Reports')
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateReportDto, @CurrentUser() currentUser: CurrentUserData) {
    return wrapResponse(
      await this.reportsService.create(dto, currentUser),
      undefined,
      'Report created',
    )
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.MODERATOR, RoleEnum.ADMIN)
  @Get()
  async list() {
    return wrapResponse(await this.reportsService.list())
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.MODERATOR, RoleEnum.ADMIN)
  @Patch(':id')
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewReportDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return wrapResponse(
      await this.reportsService.review(id, dto, currentUser),
      undefined,
      'Report updated',
    )
  }
}
