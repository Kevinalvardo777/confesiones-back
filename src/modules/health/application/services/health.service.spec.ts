import { HealthService } from 'src/modules/health/application/services/health.service'

describe('HealthService', () => {
  it('returns ok when database and redis respond', async () => {
    const service = new HealthService(
      {
        $queryRaw: jest.fn().mockResolvedValue([1]),
      } as never,
      {
        getClient: () => ({
          ping: jest.fn().mockResolvedValue('PONG'),
        }),
      } as never,
    )

    await expect(service.check()).resolves.toEqual(
      expect.objectContaining({
        status: 'ok',
        checks: {
          database: 'up',
          redis: 'up',
        },
      }),
    )
  })

  it('returns degraded when a dependency is down', async () => {
    const service = new HealthService(
      {
        $queryRaw: jest.fn().mockRejectedValue(new Error('db down')),
      } as never,
      {
        getClient: () => ({
          ping: jest.fn().mockResolvedValue('PONG'),
        }),
      } as never,
    )

    await expect(service.check()).resolves.toEqual(
      expect.objectContaining({
        status: 'degraded',
        checks: {
          database: 'down',
          redis: 'up',
        },
      }),
    )
  })
})
