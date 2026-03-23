import { HttpException } from '@nestjs/common'
import type { HttpStatus } from '@nestjs/common'

export class ApplicationException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super({ message, code, details }, statusCode)
  }
}
