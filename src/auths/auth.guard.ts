import { SendResponseService } from 'src/locales/send_response.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TranslationsService } from 'src/i18n/i18n.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        // private sendResponseService: SendResponseService,
        private translationsService: TranslationsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const cxt = context.switchToHttp();
        const req = cxt.getRequest();

        const lang = req.headers['accept-language'] || 'en';

        // Get Authorization header
        const authHeader = req.headers['authorization']

        if (!authHeader) {
            throw new UnauthorizedException(
                // this.sendResponseService.sendResponse("INVALID_AUTH", 'hi')
                await this.translationsService.translate("INVALID_AUTH", lang)
            );
        }        

        const token = authHeader.split(" ")[1];

        try {
            const decoded = this.jwtService.verify(token);
            req.user = decoded; // Attach user data to request
        } catch (error) {
            throw new UnauthorizedException(
                // this.sendResponseService.sendResponse("INVALID_TOKEN", "hi")
                await this.translationsService.translate("INVALID_TOKEN", lang)
            );
        }

        return true;
    }
}
