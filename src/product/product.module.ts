import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma.service';
import { FileService } from '../file/file.service';
import { ImagekitModule } from 'src/imagekit/imagekit.module';
import { ImagekitService } from 'src/imagekit/imagekit.service';

@Module({
  imports: [ImagekitModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, FileService, ImagekitService],
})
export class ProductModule {}
