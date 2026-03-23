import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { AppModule } from 'src/app.module'
import { setupSwagger } from 'src/config/swagger.config'
import { PrismaService } from 'src/database/prisma/prisma.service'

interface SerializableRequest {
  method?: string
  url?: string
  id?: string
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const configService = app.get(ConfigService)
  const logger = new Logger('Bootstrap')
  const isProduction = configService.getOrThrow<boolean>('app.isProduction')
  const corsOrigins = configService.getOrThrow<string[]>('app.corsOrigins')

  if (configService.getOrThrow<boolean>('app.trustProxy')) {
    app.getHttpAdapter().getInstance().set('trust proxy', 1)
  }

  app.use(
    pinoHttp({
      level: configService.getOrThrow<string>('app.logLevel'),
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      serializers: {
        req: (req: SerializableRequest) => ({
          method: req.method,
          url: req.url,
          id: req.id,
        }),
      },
    }),
  )
  app.use(
    helmet({
      hsts: isProduction,
    }),
  )
  app.use(json({ limit: configService.getOrThrow<string>('app.maxPayloadSize') }))
  app.use(
    urlencoded({ extended: true, limit: configService.getOrThrow<string>('app.maxPayloadSize') }),
  )
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
  app.setGlobalPrefix(configService.getOrThrow<string>('app.apiPrefix'))
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.getOrThrow<string>('app.apiVersion'),
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  if (configService.getOrThrow<boolean>('app.swaggerEnabled')) {
    setupSwagger(
      app,
      configService.getOrThrow<string>('app.appName'),
      configService.getOrThrow<string>('app.apiVersion'),
    )
  }

  app.get(PrismaService).enableShutdownHooks(app)

  const port = configService.getOrThrow<number>('app.port')
  await app.listen(port)
  logger.log(`API listening on port ${port}`)
}

void bootstrap()
