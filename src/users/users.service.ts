import { SendMailService } from '../mails/send_mail.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserCreateDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { SendResponseService } from 'src/locales/send_response.service';
import { TranslationsService } from 'src/i18n/i18n.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
        private jwtService: JwtService, private sendMailService: SendMailService,
        private sendResponseService: SendResponseService,
        private readonly translationsService: TranslationsService,
    ) { }

    // register a new user
    async registerUser(userCreateDto: UserCreateDto, lang: string) {
        const { name, email, password, role } = userCreateDto;
        if (!name || !email || !password) throw new BadRequestException(await this.translationsService.translate("ALL_FIELDS", lang));
        try {
            const userExist = await this.userModel.findOne({ email });
            if (userExist) {
                throw new BadRequestException(await this.translationsService.translate("USER_EXIST", lang))
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = new this.userModel({
                name,
                email,
                password: hashedPassword,
                role
            })
            await user.save();
            // return ({ message: "User registered successfully", user })
            // return this.sendResponseService.sendResponse("User registered successfully", { user });
            // return this.sendResponseService.sendResponse("USER_REGISTER", "en", { user });
            // console.log(
            //     this.translationsService.translate("USER_REGISTERED", lang, { user })
            // )
            return await this.translationsService.translate("USER_REGISTER", lang, { user });
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }
    // login  user
    async loginUser(userCreateDto: UserCreateDto, lang: string) {
        const { email, password } = userCreateDto;
        if (!email || !password) throw new BadRequestException(await this.translationsService.translate("ALL_FIELDS", lang))
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) throw new BadRequestException(await this.translationsService.translate("USER_NOT_EXIST", lang));
            const matchPassword = await bcrypt.compare(password, user.password);
            if (!matchPassword) throw new BadRequestException(await this.translationsService.translate("USER_PASSWORD_INCORRECT", lang))

            // token generation
            const token = await this.jwtService.sign({ id: user._id, email: user.email, role: user.role })
            // return ({ message: "User login successfully", token })
            // return this.sendResponseService.sendResponse("User login successfully", { token });
            // return this.sendResponseService.sendResponse("USER_LOGIN", "en", { token });
            return await this.translationsService.translate("USER_LOGIN", lang, { token })
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    // get all users
    async getAllUsers(lang: string) {
        try {
            const users = await this.userModel.find()
            if (users.length === 0) throw new NotFoundException(await this.translationsService.translate("USERS_NOT_FOUND", lang));
            // return ({ message: "Users found successfully", users })
            // return this.sendResponseService.sendResponse("Users found successfully", { users });
            // return this.sendResponseService.sendResponse("USER_FETCH", "hi", { users })
            return await this.translationsService.translate("USER_FETCH", lang, { users })
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

    // get user by id
    async getOneUser(id: string, lang: string) {
        try {
            const user = await this.userModel.findById(id)
            if (!user) throw new NotFoundException(await this.translationsService.translate("USER_NOT_FOUND", lang))
            // return ({ message: "User found successfully", user })
            // return this.sendResponseService.sendResponse("User found successfully", { user });
            // return this.sendResponseService.sendResponse("USER_FETCH", "en", { user });
            return await this.translationsService.translate("USER_FETCH", lang, { user })
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

    // update user
    async updateUser(id: string, updateUserDto: UpdateUserDto, lang: string) {
        try {
            const userUpdate = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
            // console.log(updateUserDto);

            if (!userUpdate) throw new NotFoundException(await this.translationsService.translate("USER_NOT_FOUND", lang))
            // password update in hashed password
            if (updateUserDto.password) {
                const hashedPassword = await bcrypt.hash(updateUserDto.password, 10)
                userUpdate.password = hashedPassword
            }
            await userUpdate.save()
            // return ({ message: "User updated successfully", userUpdate })
            // return this.sendResponseService.sendResponse("User updated successfully", { userUpdate });
            // return this.sendResponseService.sendResponse("USER_UPDATED", "en", { userUpdate });
            return await this.translationsService.translate("USER_UPDATED", lang, { userUpdate })
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }
    // delete user
    async deleteUser(id: string, lang: string) {
        try {
            const userDelete = await this.userModel.findByIdAndDelete(id);
            if (!userDelete) throw new NotFoundException(await this.translationsService.translate("USER_NOT_FOUND", lang));
            // return ({ message: "User deleted successfully", userDelete });
            // return this.sendResponseService.sendResponse("User deleted successfully", { userDelete });
            // return this.sendResponseService.sendResponse("USER_DELETE", "en", { userDelete });
            return await this.translationsService.translate("USER_DELETE", lang, { userDelete })
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

    // forget password
    async forgetPassword(email: string, lang: string) {
        try {
            const user = await this.userModel.findOne({ email })
            if (!user) {
                throw new NotFoundException(await this.translationsService.translate("USER_NOT_FOUND", lang))
            }
            const token = await this.jwtService.sign({ id: user._id, email: user.email });

            // save token
            user.resetToken = token;
            user.resetTokenExpiration = new Date(Date.now() + 600000); // 10 minutes
            await user.save();

            // send mail
            await this.sendMailService.ResetPasswordMail(email, token);
            // return this.sendResponseService.sendResponse("RESET_LINK", "en");
            return await this.translationsService.translate("RESET_LINK", lang);
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // reset password
    async resetPassword(token: string, password: string, lang: string) {
        try {
            const decoded = await this.jwtService.verify(token);
            const user = await this.userModel.findByIdAndUpdate(decoded.id, { password: await bcrypt.hash(password, 10) }, { new: true });
            if (!user || !user.resetTokenExpiration || user.resetTokenExpiration.getTime() < Date.now()) {
                throw new NotFoundException(await this.translationsService.translate("INVALID_TOKEN", lang))
            }

            // remove reset token
            user.resetToken = null;
            user.resetTokenExpiration = null;

            await user.save();

            // return this.sendResponseService.sendResponse("RESET_PASSWORD", "en");
            return await this.translationsService.translate("RESET_PASSWORD", lang)
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
}
