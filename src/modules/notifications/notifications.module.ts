import { Global, Module } from '@nestjs/common'
import { NotificationsService } from 'src/modules/notifications/application/services/notifications.service'

@Global()
@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
