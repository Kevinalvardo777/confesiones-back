import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ApiErrorDto {
  @ApiProperty()
  success!: boolean

  @ApiProperty()
  statusCode!: number

  @ApiProperty()
  code!: string

  @ApiProperty()
  message!: string

  @ApiPropertyOptional()
  details?: unknown

  @ApiProperty()
  timestamp!: string

  @ApiProperty()
  path!: string
}
