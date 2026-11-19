import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { setParentCookie } from './parent-cookie.js';
import { PARENT_COOKIE, verifyParentToken } from './parent-token.js';

/**
 * Bảo vệ mọi API khu phụ huynh và mọi thao tác gọi AI (Q-15).
 * Mỗi lần dùng hợp lệ thì gia hạn thêm 30 phút (tính từ thao tác cuối).
 */
@Injectable()
export class ParentModeGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const secret = this.config.getOrThrow<string>('PIN_SECRET');
    const token = (req.cookies as Record<string, string> | undefined)?.[
      PARENT_COOKIE
    ];
    const payload = verifyParentToken(token, secret);
    if (!payload) {
      throw new UnauthorizedException('Cần nhập PIN để vào khu phụ huynh');
    }
    setParentCookie(res, payload.gid, secret);
    return true;
  }
}
