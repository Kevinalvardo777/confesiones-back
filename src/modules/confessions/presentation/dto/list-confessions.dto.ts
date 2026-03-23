import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class ListConfessionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.sectionId)
  @IsString()
  communityId?: string

  @ApiPropertyOptional({ description: 'ISO date, filters confessions from that day forward' })
  @IsOptional()
  @IsString()
  createdAt?: string

  @ApiPropertyOptional({ enum: ['recent', 'top'], default: 'recent' })
  @IsOptional()
  @IsIn(['recent', 'top'])
  sort?: 'recent' | 'top'

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number
}
