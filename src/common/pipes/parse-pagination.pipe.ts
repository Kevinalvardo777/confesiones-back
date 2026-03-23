import { Injectable, PipeTransform } from '@nestjs/common'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from 'src/common/constants/app.constants'

export interface PaginationQuery {
  page: number
  pageSize: number
}

@Injectable()
export class ParsePaginationPipe implements PipeTransform<
  Record<string, unknown>,
  PaginationQuery
> {
  transform(value: Record<string, unknown>): PaginationQuery {
    const rawPage = Number(value.page ?? DEFAULT_PAGE)
    const rawPageSize = Number(value.pageSize ?? DEFAULT_PAGE_SIZE)

    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE
    const pageSize =
      Number.isFinite(rawPageSize) && rawPageSize > 0
        ? Math.min(rawPageSize, MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE

    return { page, pageSize }
  }
}
