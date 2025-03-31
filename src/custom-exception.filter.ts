import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const res = context.getResponse<Response>()
        const req = context.getResponse<Request>()
        const status = exception.getStatus()

        res.status(status).json({
            statusCode: status,
            message:exception.message,
            timestamp: new Date().toISOString(),
            path: req.url
        })

    }
}