import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix — all routes will be under /api
  app.setGlobalPrefix('api');

  // Apply JWT guard globally — all endpoints require authentication by default
  // Use @Public() decorator to skip auth for specific routes (login, register, etc.)
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  // Enable CORS so the Angular dev server (localhost:4200) can call this API
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  // Auto-validate and transform incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true // coerce types (e.g. string→number for @Param)
    })
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Finance Tracking API running on http://localhost:${port}`);
}

bootstrap();
