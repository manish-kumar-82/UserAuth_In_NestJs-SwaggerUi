import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class HideSensitiveInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const cxt = context.switchToHttp();
        const req = cxt.getRequest();

        return next.handle().pipe(map((data) => {
            return data.users.map((user) => {
                return {
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        }))
    }
}