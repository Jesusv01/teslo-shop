import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
const logger = new Logger('Bootstrap');

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/',
  });

  app.enableCors();

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .setBasePath('api')
    .addTag('Web-app')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT);
  logger.log(`App listening in po ${process.env.PORT}`);
}
bootstrap();
