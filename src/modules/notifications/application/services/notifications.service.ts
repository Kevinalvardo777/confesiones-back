import { Injectable, Logger } from '@nestjs/common'
import type { DomainEvent } from 'src/modules/notifications/application/events/domain-event.interface'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  publish<TPayload>(event: DomainEvent<TPayload>) {
    this.logger.log(
      JSON.stringify({
        event: event.name,
        occurredAt: event.occurredAt.toISOString(),
        payload: event.payload,
      }),
    )
  }
}
