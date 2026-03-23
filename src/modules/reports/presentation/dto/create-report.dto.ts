import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateReportDto {
  @ApiProperty({ enum: ['confession', 'comment'] })
  @IsString()
  @IsIn(['confession', 'comment'])
  targetType!: 'confession' | 'comment'

  @ApiProperty()
  @IsString()
  targetId!: string

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  reason!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string
}
