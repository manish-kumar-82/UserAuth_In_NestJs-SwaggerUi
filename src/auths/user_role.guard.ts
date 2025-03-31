import { TranslationsService } from 'src/i18n/i18n.service';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { SendResponseService } from 'src/locales/send_response.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private sendResponseService: SendResponseService,
        private translationsService: TranslationsService
    ) { };
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const cxt = context.switchToHttp()
        const req = cxt.getRequest();
        const lang = req.headers['accept-language'] || 'en'
        const user = req.user;
        // console.log(user)
        // Check if user has the required role
        if (!user || user.role !== "admin") {
            throw new ForbiddenException(await this.translationsService.translate("USER_ROLE", lang))

        }

        return true;
    }
}