import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { ProductModule } from './product/product.module';
import { FileModule } from './file/file.module';
import { FileService } from './file/file.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: `${path}/public`,
      serveRoot: '/public',
    }),
    ProductModule,
    FileModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [PrismaService, FileService],
  exports: [PrismaService],
})
export class AppModule {}
