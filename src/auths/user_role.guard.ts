import { TranslationsService } from 'src/i18n/i18n.service';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { SendResponseService } from 'src/locales/send_response.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        // private sendResponseService: SendResponseService,
        private translationsService: TranslationsService, private readonly reflector: Reflector
    ) { };
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());
        if (!requiredRoles) return true;
        const cxt = context.switchToHttp()
        const req = cxt.getRequest();
        const lang = req.headers['accept-language'] || 'en'
        const user = req.user;
        // console.log(user)
        // Check if user has the required role
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException(await this.translationsService.translate("USER_ROLE", lang))
        }

        return true;
    }
}