import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * MVP 1 phục vụ đúng một gia đình, một bé (không đăng nhập, Q-15).
 * Mọi chỗ cần "gia đình hiện tại" đều đi qua đây; MVP 2 có đăng nhập
 * thì chỉ cần đổi chỗ này sang lấy theo phiên.
 */
@Injectable()
export class FamilyService {
  constructor(private readonly prisma: PrismaService) {}

  async currentFamily() {
    const giaDinh = await this.prisma.giaDinh.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    if (!giaDinh) {
      throw new NotFoundException(
        'Chưa có dữ liệu gia đình. Hãy chạy: npm run db:seed',
      );
    }
    return giaDinh;
  }

  async currentChild() {
    const giaDinh = await this.currentFamily();
    const be = await this.prisma.hoSoBe.findFirst({
      where: { giaDinhId: giaDinh.id },
      orderBy: { createdAt: 'asc' },
      include: { nhanVat: true },
    });
    if (!be) throw new NotFoundException('Chưa có hồ sơ bé');
    return be;
  }
}
