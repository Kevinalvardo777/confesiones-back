import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiErrorDto } from 'src/common/dto/api-error.dto'

export function setupSwagger(app: INestApplication, appName: string, version: string): void {
  const builder = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('API de confesiones por comunidad y sector en Ecuador')
    .setVersion(`v${version}`)
    .addBearerAuth()

  const document = SwaggerModule.createDocument(app, builder.build(), {
    extraModels: [ApiErrorDto],
  })

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  })
}
