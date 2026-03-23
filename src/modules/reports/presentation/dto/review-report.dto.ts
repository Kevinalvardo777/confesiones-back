import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

export class ReviewReportDto {
  @ApiPropertyOptional({ enum: ['reviewed', 'dismissed', 'resolved'] })
  @IsOptional()
  @IsString()
  @IsIn(['reviewed', 'dismissed', 'resolved'])
  status?: 'reviewed' | 'dismissed' | 'resolved'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  resolutionNotes?: string

  @ApiPropertyOptional({ enum: ['hide', 'none'] })
  @IsOptional()
  @IsString()
  @IsIn(['hide', 'none'])
  moderationAction?: 'hide' | 'none'
}
