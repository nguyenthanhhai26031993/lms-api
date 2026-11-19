import { createHmac, timingSafeEqual } from 'node:crypto';

/** Khu phụ huynh tự khoá sau 30 phút không thao tác (ADR-003, chốt 2026-11-18). */
export const PARENT_IDLE_MS = 30 * 60 * 1000;
export const PARENT_COOKIE = 'kl_parent';

interface Payload {
  gid: string; // id gia đình
  exp: number; // hết hạn (ms)
}

/**
 * Vé "đã mở khu phụ huynh": nội dung + chữ ký HMAC bằng PIN_SECRET.
 * Lưu trong cookie HttpOnly nên JavaScript trên trang không đọc được;
 * ai sửa nội dung thì chữ ký sai và bị từ chối.
 */
export function signParentToken(gid: string, secret: string, now = Date.now()) {
  const body = Buffer.from(
    JSON.stringify({ gid, exp: now + PARENT_IDLE_MS } satisfies Payload),
  ).toString('base64url');
  const sig = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyParentToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): Payload | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', secret).update(body).digest();
  const given = Buffer.from(sig, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString()) as Payload;
    if (typeof p.gid !== 'string' || typeof p.exp !== 'number') return null;
    return p.exp > now ? p : null;
  } catch {
    return null;
  }
}
