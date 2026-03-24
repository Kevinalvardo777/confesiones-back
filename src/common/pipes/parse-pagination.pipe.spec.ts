import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from 'src/common/constants/app.constants'
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe'

describe('ParsePaginationPipe', () => {
  const pipe = new ParsePaginationPipe()

  it('uses defaults when values are missing', () => {
    expect(pipe.transform({})).toEqual({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    })
  })

  it('normalizes invalid values to defaults', () => {
    expect(pipe.transform({ page: -1, pageSize: 0 })).toEqual({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    })
  })

  it('caps page size using MAX_PAGE_SIZE', () => {
    expect(pipe.transform({ page: 2, pageSize: MAX_PAGE_SIZE + 999 })).toEqual({
      page: 2,
      pageSize: MAX_PAGE_SIZE,
    })
  })
})
