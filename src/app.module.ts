import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from 'src/modules/auth/auth.module'
import { CategoriesModule } from 'src/modules/categories/categories.module'
import { UsersModule } from 'src/modules/users/users.module'
import { CommunitiesModule } from 'src/modules/sections/sections.module'
import { ConfessionsModule } from 'src/modules/confessions/confessions.module'
import { CommentsModule } from 'src/modules/comments/comments.module'
import { ReportsModule } from 'src/modules/reports/reports.module'
import { RankingModule } from 'src/modules/ranking/ranking.module'
import { ModerationModule } from 'src/modules/moderation/moderation.module'
import { AdminModule } from 'src/modules/admin/admin.module'
import { NotificationsModule } from 'src/modules/notifications/notifications.module'
import { HealthModule } from 'src/modules/health/health.module'
import appConfig from 'src/config/app.config'
import authConfig from 'src/config/auth.config'
import databaseConfig from 'src/config/database.config'
import { resolveEnvFilePaths } from 'src/config/env-paths'
import redisConfig from 'src/config/redis.config'
import throttleConfig from 'src/config/throttle.config'
import { GlobalExceptionFilter } from 'src/common/filters/global-exception.filter'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { TransformResponseInterceptor } from 'src/common/interceptors/transform-response.interceptor'
import { PrismaModule } from 'src/database/prisma/prisma.module'
import { RedisModule } from 'src/database/redis/redis.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveEnvFilePaths(),
      load: [appConfig, authConfig, databaseConfig, redisConfig, throttleConfig],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('throttle.ttl') * 1000,
          limit: configService.getOrThrow<number>('throttle.limit'),
        },
      ],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    CategoriesModule,
    UsersModule,
    CommunitiesModule,
    ConfessionsModule,
    CommentsModule,
    ReportsModule,
    RankingModule,
    ModerationModule,
    AdminModule,
    NotificationsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
