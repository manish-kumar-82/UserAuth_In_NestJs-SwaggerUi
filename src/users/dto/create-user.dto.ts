import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UserCreateDto {
    @ApiProperty(
        {
            example: "username",
        }
    )
    @IsNotEmpty()
    name: string;

    @ApiProperty(
        { example: 'test@gmail.com' }
    )
    @IsEmail()
    email: string;

    @ApiProperty(
        { example: 'test@123' }
    )
    @IsNotEmpty()
    password: string;

    @ApiProperty(
        { example: 'role' }
    )
    @IsNotEmpty()
    role: string;

    @IsNotEmpty()
    resetToken: string;

    @IsNotEmpty()
    resetTokenExpiration: Date;
}