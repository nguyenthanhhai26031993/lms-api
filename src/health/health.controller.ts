import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  // GET /health/db — kiểm tra API có kết nối được MySQL không
  @Get('db')
  async db() {
    const users = await this.prisma.user.count();
    return { database: 'ok', users };
  }
}
