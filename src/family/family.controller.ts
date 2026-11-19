import { Controller, Get } from '@nestjs/common';
import { FamilyService } from './family.service.js';

@Controller('child')
export class FamilyController {
  constructor(private readonly family: FamilyService) {}

  // GET /api/v1/child/profile — tên gọi, nhân vật, số sticker của bé (khu bé, không cần PIN)
  @Get('profile')
  async profile() {
    const be = await this.family.currentChild();
    return {
      tenGoi: be.tenGoi,
      khoiLop: be.khoiLop,
      capNhanVat: be.capNhanVat,
      soDuSticker: be.soDuSticker,
      nhanVat: { ten: be.nhanVat.ten, hinhUrl: be.nhanVat.hinhUrl },
    };
  }
}
