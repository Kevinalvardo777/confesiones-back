import { Module } from '@nestjs/common'
import { ReportsModule } from 'src/modules/reports/reports.module'
import { CommunitiesModule } from 'src/modules/sections/sections.module'
import { UsersModule } from 'src/modules/users/users.module'
import { AdminService } from 'src/modules/admin/application/services/admin.service'
import { AdminController } from 'src/modules/admin/presentation/controllers/admin.controller'

@Module({
  imports: [UsersModule, CommunitiesModule, ReportsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
