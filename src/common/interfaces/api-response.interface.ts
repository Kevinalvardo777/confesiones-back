export interface ApiResponseMeta {
  page?: number
  pageSize?: number
  total?: number
  [key: string]: unknown
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: ApiResponseMeta
  timestamp: string
}
