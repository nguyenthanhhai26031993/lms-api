import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  // Cổng 4000: FE Next.js chuyển tiếp /api/* sang đây (ADR-005).
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
