/**
 * Tạo dữ liệu khởi tạo cho MVP 1: một gia đình, một bé, cấu hình mặc định
 * và danh sách nhân vật. Chạy lại nhiều lần không sinh trùng.
 *
 *   npm run db:seed                 # tạo nếu chưa có
 *   npm run db:seed -- --reset-pin  # đặt lại PIN theo SEED_PIN
 */
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client.js';

const NHAN_VAT = [
  { ten: 'Xe đua đỏ', hinhUrl: '/characters/xe-dua-do.svg' },
  { ten: 'Xe đua xanh', hinhUrl: '/characters/xe-dua-xanh.svg' },
  { ten: 'Siêu xe vàng', hinhUrl: '/characters/sieu-xe-vang.svg' },
] as const;

async function main() {
  const pin = process.env.SEED_PIN;
  if (!pin || !/^\d{4}$/.test(pin)) {
    throw new Error('Cần đặt SEED_PIN (4 chữ số) trong file .env');
  }
  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb({
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME!,
      allowPublicKeyRetrieval: true,
    }),
  });

  try {
    for (const nv of NHAN_VAT) {
      const co = await prisma.nhanVat.findFirst({ where: { ten: nv.ten } });
      if (!co) {
        await prisma.nhanVat.create({
          data: { ...nv, chuDe: 'XE', loai: 'AVATAR' },
        });
      }
    }
    const avatar = await prisma.nhanVat.findFirstOrThrow({
      where: { loai: 'AVATAR' },
      orderBy: { createdAt: 'asc' },
    });

    let gd = await prisma.giaDinh.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!gd) {
      gd = await prisma.giaDinh.create({
        data: {
          tenGiaDinh: process.env.SEED_FAMILY_NAME ?? 'Gia đình KidLearn',
          pinBam: await bcrypt.hash(pin, 10),
          cauHinh: { create: {} },
          hoSoBe: {
            create: {
              tenGoi: process.env.SEED_CHILD_NAME ?? 'Bé',
              khoiLop: 'Cambridge Primary Stage 1',
              nhanVatId: avatar.id,
            },
          },
        },
      });
      console.log('Đã tạo gia đình, hồ sơ bé và cấu hình mặc định.');
    } else if (process.argv.includes('--reset-pin')) {
      await prisma.giaDinh.update({
        where: { id: gd.id },
        data: {
          pinBam: await bcrypt.hash(pin, 10),
          soLanSaiPin: 0,
          khoaPinDen: null,
        },
      });
      console.log('Đã đặt lại PIN.');
    } else {
      console.log('Dữ liệu khởi tạo đã có, không đổi gì.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

await main();
