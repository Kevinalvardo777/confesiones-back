import { Module } from '@nestjs/common'
import { UsersService } from 'src/modules/users/application/services/users.service'
import { UsersRepository } from 'src/modules/users/infrastructure/repositories/users.repository'
import { UsersController } from 'src/modules/users/presentation/controllers/users.controller'

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
