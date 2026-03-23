import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const request = context.getRequest<Request>()
    const response = context.getResponse<Response>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const payload = exception instanceof HttpException ? exception.getResponse() : null

    const body =
      typeof payload === 'object' && payload !== null
        ? (payload as Record<string, unknown>)
        : { message: 'Unexpected internal server error', code: 'INTERNAL_SERVER_ERROR' }

    if (status >= 500) {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      )
    }

    const code =
      typeof body.code === 'string'
        ? body.code
        : body.code !== undefined
          ? JSON.stringify(body.code)
          : 'REQUEST_FAILED'
    const message =
      typeof body.message === 'string'
        ? body.message
        : body.message !== undefined
          ? JSON.stringify(body.message)
          : 'Request failed'

    response.status(status).json({
      success: false,
      statusCode: status,
      code,
      message,
      details: body.details,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
