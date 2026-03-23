import { Test } from '@nestjs/testing'
import { CommunitiesService } from 'src/modules/sections/application/services/sections.service'
import { CommunitiesController } from 'src/modules/sections/presentation/controllers/sections.controller'

describe('CommunitiesController', () => {
  it('returns wrapped communities', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommunitiesController],
      providers: [
        {
          provide: CommunitiesService,
          useValue: {
            list: jest.fn().mockResolvedValue([
              {
                id: 'iess-ceibos',
                slug: 'iess-ceibos',
                name: 'IESS Ceibos',
                city: 'Guayaquil',
                accent: '#FF6B35',
                headline: 'Confesiones del IESS Ceibos',
                description: 'Demo',
                confessionsCount: 0,
              },
            ]),
          },
        },
      ],
    }).compile()

    const controller = moduleRef.get(CommunitiesController)
    const result = await controller.list()

    expect(result).toEqual({
      data: [
        expect.objectContaining({
          id: 'iess-ceibos',
        }),
      ],
      meta: undefined,
      message: undefined,
    })
  })
})
