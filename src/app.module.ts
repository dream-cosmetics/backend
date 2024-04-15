import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { ProductModule } from './product/product.module';
import { FileModule } from './file/file.module';
import { FileService } from './file/file.service';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { ImagekitModule } from './imagekit/imagekit.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { MorganMiddleware } from './middleware/logger.middleware';

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
    UserModule,
    ImagekitModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [PrismaService, FileService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
