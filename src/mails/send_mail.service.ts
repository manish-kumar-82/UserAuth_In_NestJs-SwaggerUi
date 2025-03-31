import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SendMailService {
    constructor(private readonly mailerService: MailerService) { }

    async ResetPasswordMail(email: string, token: string) {
        try {
            const resetLink = `http://localhost:3000/users/reset-password/${token}`;
            await this.mailerService.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: "Reset Password",
                html: `
                <h1>Reset Password</h1>
                <p>To reset your password, click the following link:</p>
                <a href="${resetLink}">Reset Password</a>`
            })
            return;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}