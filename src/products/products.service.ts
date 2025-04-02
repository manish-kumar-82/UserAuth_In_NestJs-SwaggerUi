import { UpdateProductDto } from './dto/update-product.dto';
import { TranslationsService } from './../i18n/i18n.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name)
    private readonly productModel: Model<Product>,
        private readonly translationsService: TranslationsService
    ) { }

    // create a new product
    async createProduct(createProductDto: CreateProductDto, lang: string) {
        const { name, price, description, quantity } = createProductDto;
        if (!name || !price || !description || !quantity) {
            throw new NotFoundException(await this.translationsService.translate("ALL_FIELDS", lang))
        }
        try {
            const productExist = await this.productModel.findOne({ name });
            if (productExist) {
                throw new BadRequestException(await this.translationsService.translate("PRODUCT_EXIST", lang))
            }
            const product = new this.productModel({
                name, price, description, quantity
            })
            await product.save();
            return await this.translationsService.translate("PRODUCT_ADDED", lang, product)
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }


    // fetch all products
    async getAllProducts(lang: string, page: number, limit: number, search: any) {
        try {
            const filter: any = {};
            if (search) {
                // search by name ,price, description and quantity in case of search query
                if (!isNaN(search)) {
                    filter.$or = [
                        { price: Number(search) }, { quantity: Number(search) }
                    ]
                } else {
                    filter.$or = [
                        { name: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                }
            }
            const products = await this.productModel.find(filter).skip((page - 1) * limit).limit(limit);
            if (products.length === 0) {
                throw new NotFoundException(await this.translationsService.translate("PRODUCT_NOT_FOUND", lang))
            }
            return await this.translationsService.translate("FETCH_PRODUCTS", lang, products)
        } catch (error) {
            throw new BadRequestException(error.message)
        }

    }

    // find one product by id
    async getOneProduct(id: string, lang: string) {
        try {
            const product = await this.productModel.findById(id);
            if (!product) throw new NotFoundException(await this.translationsService.translate("PRODUCT_NOT_FOUND", lang));
            return await this.translationsService.translate("PRODUCT_FOUND", lang, product)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // update product
    async updateProduct(id: string, updateProductDto: UpdateProductDto, lang: string) {
        try {

            const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
            if (!product) throw new NotFoundException(await this.translationsService.translate("PRODUCT_NOT_FOUND", lang));
            return await this.translationsService.translate("PRODUCT_UPDATE", lang, product);

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // delete product
    async deleteProduct(id: string, lang: string) {
        try {
            const product = await this.productModel.findByIdAndDelete(id);
            if (!product) throw new NotFoundException(await this.translationsService.translate("PRODUCT_NOT_FOUND", lang));
            return await this.translationsService.translate("PRODUCT_DELETE", lang, product);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
