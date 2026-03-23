import { Module } from '@nestjs/common'
import { CategoriesService } from 'src/modules/categories/application/services/categories.service'
import { CategoriesRepository } from 'src/modules/categories/infrastructure/repositories/categories.repository'
import { CategoriesController } from 'src/modules/categories/presentation/controllers/categories.controller'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
