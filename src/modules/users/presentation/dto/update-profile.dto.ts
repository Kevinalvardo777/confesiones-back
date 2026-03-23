import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Maria Campos' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  displayName?: string

  @ApiPropertyOptional({
    example: { emailNotifications: false, theme: 'system' },
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>
}
