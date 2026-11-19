import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  // GET /api/v1/health — API đang chạy
  @Get()
  ok() {
    return { status: 'ok' };
  }

  // GET /api/v1/health/db — API kết nối được MySQL và đã có dữ liệu khởi tạo
  @Get('db')
  async db() {
    const giaDinh = await this.prisma.giaDinh.count();
    return { database: 'ok', giaDinh };
  }
}
