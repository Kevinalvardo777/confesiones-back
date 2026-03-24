import { wrapResponse } from 'src/common/utils/response.util'

describe('wrapResponse', () => {
  it('returns a response envelope with data only', () => {
    expect(wrapResponse({ ok: true })).toEqual({
      data: { ok: true },
      meta: undefined,
      message: undefined,
    })
  })

  it('returns a response envelope with optional fields', () => {
    expect(wrapResponse({ ok: true }, { page: 1, pageSize: 10, total: 20 }, 'Done')).toEqual({
      data: { ok: true },
      meta: { page: 1, pageSize: 10, total: 20 },
      message: 'Done',
    })
  })
})
