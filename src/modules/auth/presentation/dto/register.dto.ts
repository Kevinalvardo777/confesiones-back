import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'Andrea Solis' })
  @IsString()
  @MaxLength(80)
  name!: string

  @ApiProperty({ example: 'andrea@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must include at least one letter and one number',
  })
  password!: string
}
