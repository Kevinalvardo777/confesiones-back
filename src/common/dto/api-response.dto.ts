import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ApiMetaDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  pageSize?: number

  @ApiPropertyOptional()
  total?: number
}

export class ApiResponseDto<TData> {
  @ApiProperty()
  success!: boolean

  @ApiProperty()
  message!: string

  @ApiProperty()
  data!: TData

  @ApiPropertyOptional({ type: ApiMetaDto })
  meta?: ApiMetaDto

  @ApiProperty()
  timestamp!: string
}
