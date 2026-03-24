import { VersioningType } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { HealthController } from 'src/modules/health/presentation/controllers/health.controller'
import { HealthService } from 'src/modules/health/application/services/health.service'

describe('App (e2e)', () => {
  let app: INestApplication
  const healthServiceMock = {
    check: jest.fn().mockResolvedValue({
      status: 'ok',
      checks: { database: 'up', redis: 'up' },
      timestamp: '2026-03-24T00:00:00.000Z',
    }),
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthServiceMock }],
    })
      .overrideProvider(HealthService)
      .useValue(healthServiceMock)
      .compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/api/v1/health (GET) returns health payload', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0]

    const response = await request(httpServer).get('/api/v1/health').expect(200)

    expect(response.body).toEqual({
      status: 'ok',
      checks: { database: 'up', redis: 'up' },
      timestamp: '2026-03-24T00:00:00.000Z',
    })
    expect(healthServiceMock.check).toHaveBeenCalledTimes(1)
  })
})
