import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const logger = new Logger(AppModule.name);
  const PORT = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Handmade beauty store API')
    .setDescription('Handmade beauty store API description')
    .setVersion('1.0')
    .addTag('Handmade beauty store')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);
  logger.debug(`Application listening on port ${PORT}`);
}
bootstrap();
