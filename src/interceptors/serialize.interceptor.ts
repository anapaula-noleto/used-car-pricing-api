import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { ClassConstructor, plainToInstance } from "class-transformer";

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<T> {
    // Run something before a request is handled by the request handler
    //console.log("I'm running before the handler");

    // Run code that will happen after the request is handled by the request handler
    return handler.handle().pipe(
      map((data: T) => {
        // Run something before the response is sent out
        //console.log("I'm running before the response is sent out", data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
