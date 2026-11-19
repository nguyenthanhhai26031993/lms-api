import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { clearParentCookie, setParentCookie } from './parent-cookie.js';
import { ParentModeGuard } from './parent-mode.guard.js';
import { PARENT_COOKIE, verifyParentToken } from './parent-token.js';
import { PinService } from './pin.service.js';

@Controller('parent')
export class ParentAuthController {
  constructor(
    private readonly pin: PinService,
    private readonly config: ConfigService,
  ) {}

  // POST /api/v1/parent/unlock { pin } — mở khu phụ huynh
  @Post('unlock')
  @HttpCode(200)
  async unlock(
    @Body() body: { pin?: unknown },
    @Res({ passthrough: true }) res: Response,
  ) {
    const gid = await this.pin.verify(body?.pin);
    setParentCookie(res, gid, this.config.getOrThrow('PIN_SECRET'));
    return { parentMode: true };
  }

  // POST /api/v1/parent/lock — nút "Khoá" trên thanh trên khu phụ huynh
  @Post('lock')
  @HttpCode(200)
  lock(@Res({ passthrough: true }) res: Response) {
    clearParentCookie(res);
    return { parentMode: false };
  }

  // GET /api/v1/parent/status — khu phụ huynh đang mở hay khoá (không gia hạn)
  @Get('status')
  status(@Req() req: Request) {
    const token = (req.cookies as Record<string, string> | undefined)?.[
      PARENT_COOKIE
    ];
    const p = verifyParentToken(token, this.config.getOrThrow('PIN_SECRET'));
    return { parentMode: !!p };
  }

  // GET /api/v1/parent/ping — mẫu một API được bảo vệ bằng PIN
  @Get('ping')
  @UseGuards(ParentModeGuard)
  ping() {
    return { parentMode: true };
  }
}
