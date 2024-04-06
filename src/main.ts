import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableShutdownHooks();

  const logger = new Logger(AppModule.name);
  const PORT = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Dream Cosmetics')
    .setDescription('Dream Cosmetics')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // const pathYml = path.join(process.cwd(), './docs/openapi.yml');
  // const file = fs.readFileSync(pathYml, 'utf-8');
  // const yamlDocument: OpenAPIObject = yaml.parse(file);
  // SwaggerModule.setup('swagger', app, yamlDocument);

  await app.listen(PORT);
  logger.debug(`Application listening on port ${PORT}`);
}
bootstrap().then();
