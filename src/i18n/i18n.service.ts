import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslationsService {
    constructor(private readonly i18n: I18nService) { }

    async translate(key: string, lang: string,
        args?: Record<string, any>,
    ) {
        const message = this.i18n.translate(`common.${key}`, { lang, args },);
        return { message, args }
    }
}
