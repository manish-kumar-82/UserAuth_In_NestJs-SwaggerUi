import { BadRequestException, Injectable } from '@nestjs/common';
import { translations } from './translation';
@Injectable()
export class SendResponseService {
  sendResponse(key: string, lang: string, data?: any) {
    const message = translations[lang]?.[key] || translations['en'][key];
    if (!message) {
      throw new BadRequestException('Translation not found');
    }
    return { message, data };
  };
}
