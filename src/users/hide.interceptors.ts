import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class HideSensitiveInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const cxt = context.switchToHttp();
        const req = cxt.getRequest();

        return next.handle().pipe(map((data) => {
            return {
                message: data.message,
                name: data.args.user.name,
                email: data.args.user.email,
                role: data.args.user.role,
            }
        }))
    }
}   