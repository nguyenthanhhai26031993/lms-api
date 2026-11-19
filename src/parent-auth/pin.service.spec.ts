import bcrypt from 'bcryptjs';
import { MAX_WRONG_PIN, PIN_LOCK_MS, PinService } from './pin.service.js';

function setup(state: { soLanSaiPin: number; khoaPinDen: Date | null }) {
  const gd = { id: 'gd-1', pinBam: bcrypt.hashSync('1234', 4), ...state };
  const update = vi.fn(({ data }) => Object.assign(gd, data));
  const prisma = { giaDinh: { update } } as never;
  const family = { currentFamily: vi.fn(async () => gd) } as never;
  return { svc: new PinService(prisma, family), gd, update };
}

describe('PinService (BRL-010)', () => {
  it('PIN đúng: trả id gia đình và xoá bộ đếm sai', async () => {
    const { svc, gd } = setup({ soLanSaiPin: 3, khoaPinDen: null });
    await expect(svc.verify('1234')).resolves.toBe('gd-1');
    expect(gd.soLanSaiPin).toBe(0);
  });

  it('PIN sai định dạng: báo lỗi 400, không tính lần sai', async () => {
    const { svc, update } = setup({ soLanSaiPin: 0, khoaPinDen: null });
    await expect(svc.verify('12a4')).rejects.toMatchObject({ status: 400 });
    expect(update).not.toHaveBeenCalled();
  });

  it('PIN sai: 401 và báo số lần còn lại', async () => {
    const { svc } = setup({ soLanSaiPin: 1, khoaPinDen: null });
    await expect(svc.verify('0000')).rejects.toMatchObject({
      status: 401,
      response: { conLai: MAX_WRONG_PIN - 2 },
    });
  });

  it('Sai lần thứ 5: khoá 5 phút (423)', async () => {
    const now = new Date('2026-11-19T10:00:00Z');
    const { svc, gd } = setup({
      soLanSaiPin: MAX_WRONG_PIN - 1,
      khoaPinDen: null,
    });
    await expect(svc.verify('0000', now)).rejects.toMatchObject({
      status: 423,
    });
    expect(gd.khoaPinDen?.getTime()).toBe(now.getTime() + PIN_LOCK_MS);
  });

  it('Đang khoá: từ chối cả PIN đúng', async () => {
    const now = new Date('2026-11-19T10:00:00Z');
    const { svc } = setup({
      soLanSaiPin: 0,
      khoaPinDen: new Date(now.getTime() + 60_000),
    });
    await expect(svc.verify('1234', now)).rejects.toMatchObject({
      status: 423,
    });
  });

  it('Hết khoá: PIN đúng vào được', async () => {
    const now = new Date('2026-11-19T10:00:00Z');
    const { svc } = setup({
      soLanSaiPin: 0,
      khoaPinDen: new Date(now.getTime() - 1),
    });
    await expect(svc.verify('1234', now)).resolves.toBe('gd-1');
  });
});
