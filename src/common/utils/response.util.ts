import type { ApiResponseMeta } from 'src/common/interfaces/api-response.interface'

export function wrapResponse<T>(data: T, meta?: ApiResponseMeta, message?: string) {
  return { data, meta, message }
}
