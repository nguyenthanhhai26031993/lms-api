import type { Response } from 'express';
import {
  PARENT_COOKIE,
  PARENT_IDLE_MS,
  signParentToken,
} from './parent-token.js';

export function setParentCookie(res: Response, gid: string, secret: string) {
  res.cookie(PARENT_COOKIE, signParentToken(gid, secret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: PARENT_IDLE_MS,
    path: '/',
  });
}

export function clearParentCookie(res: Response) {
  res.clearCookie(PARENT_COOKIE, { path: '/' });
}
