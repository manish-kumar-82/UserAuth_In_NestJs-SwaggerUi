import { AuthGuard } from 'src/auths/auth.guard';
import { UserCreateDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoleGuard } from 'src/auths/user_role.guard';
import { HideSensitiveInterceptor } from './hide.interceptors';
import { I18nLang } from 'nestjs-i18n';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiHeader({
    name: "accept-language",
})
@ApiTags("User Authentication")
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    // add User
    @Post('register')
    register(@Body() userCreateDto: UserCreateDto, @I18nLang() lang: string) {
        return this.usersService.registerUser(userCreateDto, lang)
    }
    @Post('login')
    login(@Body() userCreateDto: UserCreateDto, @I18nLang() lang: string) {
        return this.usersService.loginUser(userCreateDto, lang);
    }

    // get all users  
    @ApiQuery({
        name: 'page',
        type: Number,
        required: false
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false
    })
    @ApiQuery({
        name: 'search',
        type: String,
        required: false
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Get('all-users')
    get(
        @I18nLang() lang: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        return this.usersService.getAllUsers(lang, page, limit, search);
    }
    // get user by id
    @UseInterceptors(HideSensitiveInterceptor)
    @UseGuards(AuthGuard)
    @Get("get-user/:id")

    getOneUser(@Param('id') id: string, @I18nLang() lang: string) {
        return this.usersService.getOneUser(id, lang)
    }
    // update user
    // @UseInterceptors(HideSensitiveInterceptor)
    @UseGuards(AuthGuard)
    @Put('update-user/:id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @I18nLang() lang: string) {
        return this.usersService.updateUser(id, updateUserDto, lang)
    }

    // delete user
    @UseGuards(AuthGuard)
    @Delete('delete-user/:id')
    delete(@Param('id') id: string, @I18nLang() lang: string) {
        return this.usersService.deleteUser(id, lang)
    }

    // forget password
    @Post('forget-password')
    @ApiBody({
        schema: {
            type: "object",
            required: ["email"]
        },
    })
    forgetPassword(@Body('email') email: string, @I18nLang() lang: string) {
        return this.usersService.forgetPassword(email, lang)
    }

    // reset password
    @Post('reset-password/:token')
    @ApiBody({
        schema: {
            type: "object",
            required: ["password"]
        },
    })
    resetPassword(@Param('token') token: string, @Body("password") password: string, @I18nLang() lang: string) {
        return this.usersService.resetPassword(token, password, lang)
    }

}
