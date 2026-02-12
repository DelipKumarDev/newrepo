import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // Basic in-memory rate limiter (simple/demo only)
  const rateMap = new Map<string, { count: number; reset: number }>();
  app.use((req: Request, res: Response, next: NextFunction) => {
    try {
      const key = req.ip || 'global';
      const now = Date.now();
      const entry = rateMap.get(key) || { count: 0, reset: now + 60 * 1000 };
      if (now > entry.reset) {
        entry.count = 0;
        entry.reset = now + 60 * 1000;
      }
      entry.count += 1;
      rateMap.set(key, entry);
      if (entry.count > 120) {
        res.status(429).json({ message: 'Too many requests' });
        return;
      }
    } catch (err) {
      // ignore rate errors
    }
    next();
  });

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  const { AllExceptionsFilter } = await import('./common/filters/all-exceptions.filter');
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Logistics ERP API')
    .setDescription('Multi-tenant logistics ERP SaaS platform API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  console.log(`Server running on port ${port}`);

  // Seed default tenant + admin for local/dev
  try {
    const { seedDefaultAdmin } = await import('./common/seed');
    await seedDefaultAdmin();
  } catch (err) {
    console.warn('Seeding skipped or failed:', (err as any)?.message || String(err));
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
