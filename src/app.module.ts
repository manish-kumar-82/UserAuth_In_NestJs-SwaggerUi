import { i18nConfig } from './i18n/i18n.config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { SendMailModule } from './mails/send_mail.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    I18nModule.forRoot(i18nConfig), SendMailModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],

})
export class AppModule { }
