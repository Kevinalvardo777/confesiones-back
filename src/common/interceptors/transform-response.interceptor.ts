import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'
import { API_RESPONSE_MESSAGE } from 'src/common/constants/app.constants'
import type { ApiResponse, ApiResponseMeta } from 'src/common/interfaces/api-response.interface'

type WrappedData<T> = { data: T; message?: string; meta?: ApiResponseMeta }

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T | WrappedData<T>,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T | WrappedData<T>>,
  ): Observable<ApiResponse<T>> {
    const message =
      this.reflector.get<string>('responseMessage', context.getHandler()) ?? API_RESPONSE_MESSAGE

    return next.handle().pipe(
      map((result) => {
        if (typeof result === 'object' && result !== null && 'data' in result) {
          const wrapped: WrappedData<T> = result

          return {
            success: true,
            message: wrapped.message ?? message,
            data: wrapped.data,
            meta: wrapped.meta,
            timestamp: new Date().toISOString(),
          }
        }

        return {
          success: true,
          message,
          data: result,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }
}
