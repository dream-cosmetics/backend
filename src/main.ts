import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const logger = new Logger(AppModule.name);
  const PORT = process.env.PORT || 3000;

  const pathYml = path.join(process.cwd(), './docs/openapi.yml');
  const file = fs.readFileSync(pathYml, 'utf-8');
  const yamlDocument: OpenAPIObject = yaml.parse(file);
  SwaggerModule.setup('swagger', app, yamlDocument);

  await app.listen(PORT);
  logger.debug(`Application listening on port ${PORT}`);
}
bootstrap().then();
