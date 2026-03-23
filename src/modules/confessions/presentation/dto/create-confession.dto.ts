import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateConfessionDto {
  @ApiProperty()
  @Transform(({ value, obj }) => value ?? obj.sectionId)
  @IsString()
  communityId!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  alias?: string

  @ApiProperty({ minLength: 10, maxLength: 1200 })
  @IsString()
  @MinLength(10)
  @MaxLength(1200)
  content!: string
}
