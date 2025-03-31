import { Module } from "@nestjs/common";
import { SendMailService } from "./send_mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            }
        })
    ],
    controllers: [],
    providers: [SendMailService],
    exports: [SendMailService]
})
export class SendMailModule { }