import { Module } from '@nestjs/common'
import { ConfessionsModule } from 'src/modules/confessions/confessions.module'
import { CommentsService } from 'src/modules/comments/application/services/comments.service'
import { CommentsRepository } from 'src/modules/comments/infrastructure/repositories/comments.repository'
import { CommentsController } from 'src/modules/comments/presentation/controllers/comments.controller'

@Module({
  imports: [ConfessionsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
