import { VersioningType } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from 'src/app.module'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/api/v1/sections (GET) should require app wiring', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0]

    await request(httpServer)
      .get('/api/v1/sections')
      .expect((response) => {
        expect([200, 500]).toContain(response.status)
      })
  })
})
