import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        example: 'Sample Product',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 19.99,
    })
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        example: 'This is a sample product',
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: 10,
    })
    @IsNotEmpty()
    quantity: number;
}