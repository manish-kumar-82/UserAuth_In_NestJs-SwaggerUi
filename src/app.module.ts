import { i18nConfig } from './i18n/i18n.config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { I18nModule } from 'nestjs-i18n';
import { SendMailModule } from './mails/send_mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    I18nModule.forRoot(i18nConfig), SendMailModule,
    UsersModule,
  ],
  controllers: [],
  providers: [NotificationsGateway],

})
export class AppModule { }
