import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  confessionId!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  authorName?: string

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  content!: string
}
