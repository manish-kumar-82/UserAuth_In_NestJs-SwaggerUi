import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { User, UserSchema } from './schema/user.schema';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SendResponseService } from 'src/locales/send_response.service';
import { TranslationsService } from 'src/i18n/i18n.service';
import { SendMailService } from 'src/mails/send_mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1h' },
    }),

  ],
  controllers: [UsersController],
  providers: [UsersService, SendResponseService, TranslationsService, SendMailService,NotificationsGateway],
  exports: []
})
export class UsersModule {
}
