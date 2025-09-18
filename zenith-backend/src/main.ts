import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend access
  app.enableCors({
    origin: '*', // In production, restrict this to the frontend URL
  });

  // Global validation pipe for request DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have any decorators
    transform: true, // Transform payloads to be instances of DTO classes
  }));

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
