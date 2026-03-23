import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/common/enums/role.enum'
import { wrapResponse } from 'src/common/utils/response.util'
import { AdminService } from 'src/modules/admin/application/services/admin.service'

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(RoleEnum.ADMIN)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  async metrics() {
    return wrapResponse(await this.adminService.getMetrics())
  }

  @Get('users')
  async users() {
    return wrapResponse(await this.adminService.listUsers())
  }

  @Get('communities')
  async communities() {
    return wrapResponse(await this.adminService.listCommunities())
  }

  @Get('reports')
  async reports() {
    return wrapResponse(await this.adminService.listReports())
  }

  @Get('confessions')
  async confessions() {
    return wrapResponse(await this.adminService.listConfessions())
  }

  @Get('comments')
  async comments() {
    return wrapResponse(await this.adminService.listComments())
  }
}
