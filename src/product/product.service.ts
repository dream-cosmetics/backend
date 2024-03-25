import {Injectable} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {PrismaService} from '../prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {
    }

    createProduct(createProductDto: CreateProductDto) {
        this.prisma.product.create({
            data: createProductDto,
        });
    }

    getProducts() {
        return `This action returns all product`;
    }

    getProductById(id: number) {
        return `This action returns a #${id} product`;
    }

    updateProduct(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    removeProduct(id: number) {
        return `This action removes a #${id} product`;
    }
}
