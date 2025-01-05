import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //handle request here
    console.log('Interceptor run :', context);

    //handle response here
    return next.handle().pipe(
      map((data: any) => {
        console.log('Run before response');
      }),
    );
  }
}
