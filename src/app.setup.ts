import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

/** Cấu hình dùng chung cho chạy thật và cho test. */
export function configureApp(app: INestApplication) {
  // Mọi API nằm dưới /api/v1 (ADR-003, ADR-005).
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  // Trình duyệt gọi qua proxy cùng origin; CORS chỉ mở cho FE và localhost.
  const origins = (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({ origin: origins, credentials: true });
}
