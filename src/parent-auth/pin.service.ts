import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { FamilyService } from '../family/family.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** BRL-010: sai 5 lần liên tiếp thì khoá 5 phút. */
export const MAX_WRONG_PIN = 5;
export const PIN_LOCK_MS = 5 * 60 * 1000;

@Injectable()
export class PinService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly family: FamilyService,
  ) {}

  /** Kiểm tra PIN phía máy chủ (Q-15). Trả về id gia đình khi đúng. */
  async verify(pin: unknown, now = new Date()): Promise<string> {
    if (typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
      throw new BadRequestException('PIN phải gồm đúng 4 chữ số');
    }
    const gd = await this.family.currentFamily();

    if (gd.khoaPinDen && gd.khoaPinDen > now) {
      throw new HttpException(
        {
          message: 'Nhập sai quá nhiều lần, vui lòng thử lại sau',
          khoaDen: gd.khoaPinDen.toISOString(),
        },
        HttpStatus.LOCKED,
      );
    }

    const ok = await bcrypt.compare(pin, gd.pinBam);
    if (ok) {
      await this.prisma.giaDinh.update({
        where: { id: gd.id },
        data: { soLanSaiPin: 0, khoaPinDen: null },
      });
      return gd.id;
    }

    // Hết thời gian khoá thì đếm lại từ đầu.
    const daSai = (gd.khoaPinDen ? 0 : gd.soLanSaiPin) + 1;
    const biKhoa = daSai >= MAX_WRONG_PIN;
    const khoaDen = biKhoa ? new Date(now.getTime() + PIN_LOCK_MS) : null;
    await this.prisma.giaDinh.update({
      where: { id: gd.id },
      data: { soLanSaiPin: biKhoa ? 0 : daSai, khoaPinDen: khoaDen },
    });
    if (biKhoa) {
      throw new HttpException(
        {
          message: 'Nhập sai quá nhiều lần, vui lòng thử lại sau',
          khoaDen: khoaDen!.toISOString(),
        },
        HttpStatus.LOCKED,
      );
    }
    throw new UnauthorizedException({
      message: 'PIN chưa đúng',
      conLai: MAX_WRONG_PIN - daSai,
    });
  }

  static hash(pin: string) {
    return bcrypt.hash(pin, 10);
  }
}
