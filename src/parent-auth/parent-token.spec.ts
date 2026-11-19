import {
  PARENT_IDLE_MS,
  signParentToken,
  verifyParentToken,
} from './parent-token.js';

const SECRET = 'x'.repeat(32);

describe('parent token', () => {
  it('chấp nhận vé hợp lệ còn hạn', () => {
    const t = signParentToken('gd-1', SECRET, 1000);
    expect(verifyParentToken(t, SECRET, 1000 + PARENT_IDLE_MS - 1)?.gid).toBe(
      'gd-1',
    );
  });

  it('từ chối vé quá 30 phút không thao tác', () => {
    const t = signParentToken('gd-1', SECRET, 1000);
    expect(verifyParentToken(t, SECRET, 1000 + PARENT_IDLE_MS)).toBeNull();
  });

  it('từ chối vé bị sửa nội dung hoặc ký bằng khoá khác', () => {
    const t = signParentToken('gd-1', SECRET);
    const [, sig] = t.split('.');
    const fake = Buffer.from(
      JSON.stringify({ gid: 'gd-2', exp: Date.now() + 1e9 }),
    ).toString('base64url');
    expect(verifyParentToken(`${fake}.${sig}`, SECRET)).toBeNull();
    expect(verifyParentToken(t, 'y'.repeat(32))).toBeNull();
    expect(verifyParentToken(undefined, SECRET)).toBeNull();
    expect(verifyParentToken('rac', SECRET)).toBeNull();
  });
});
