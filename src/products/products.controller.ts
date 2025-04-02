import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { I18nLang } from 'nestjs-i18n';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auths/auth.guard';
import { RoleGuard } from 'src/auths/user_role.guard';
@ApiBearerAuth()
@ApiHeader({
    name: "accept-language",
    required: false
})
@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    //  add products
    @SetMetadata('roles', ["admin", "seller"])
    @UseGuards(AuthGuard, RoleGuard)
    @Post('add-product')
    addProduct(@Body() createProductDto: CreateProductDto, @I18nLang() lang: string) {
        return this.productService.createProduct(createProductDto, lang)
    }

    // Get All Products
    @ApiQuery({
        name: "page",
        type: Number,
        required: false
    })
    @ApiQuery({
        name: "limit",
        type: Number,
        required: false
    })
    @ApiQuery({
        name: "search",
        required: false
    })
    @Get('get-all-products')
    getAllProducts(@I18nLang() lang: string,
        @Query('page')
        page: number,
        @Query('limit')
        limit: number,
        @Query('search')
        search: any) {
        return this.productService.getAllProducts(lang, page, limit, search)
    }

    // Get Single Product
    @Get('get-product/:id')
    getProductById(@Param('id') id: string, @I18nLang() lang: string) {
        return this.productService.getOneProduct(id, lang)
    }

    // Update Product
    @SetMetadata('roles', ["admin", "seller"])
    @UseGuards(AuthGuard, RoleGuard)
    @Put('update-product/:id')
    updateProduct(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto, @I18nLang() lang: string) {
        return this.productService.updateProduct(id, updateProductDto, lang)
    }

    // Delete Product
    @SetMetadata('roles', ["admin"])
    @UseGuards(AuthGuard, RoleGuard)
    @Delete('delete-product/:id')
    deleteProduct(@Param('id') id: string, @I18nLang() lang: string) {
        return this.productService.deleteProduct(id, lang)
    }
}
