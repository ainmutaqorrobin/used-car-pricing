import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto)); 
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private DTO: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //handle request here

    //handle response here
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.DTO, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
