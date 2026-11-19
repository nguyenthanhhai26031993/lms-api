/**
 * Kiểm thử đầu-cuối với MySQL thật (cần .env, đã chạy db:migrate và db:seed,
 * SEED_PIN trong .env là PIN hiện tại).
 */
import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('KidLearn API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = mod.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health và /health/db', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200, { status: 'ok' });
    const r = await request(app.getHttpServer())
      .get('/api/v1/health/db')
      .expect(200);
    expect(r.body.giaDinh).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/child/profile không cần PIN', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/child/profile')
      .expect(200);
    expect(r.body.tenGoi).toBeTruthy();
  });

  it('Khu phụ huynh: chưa PIN bị chặn, PIN đúng vào được, Khoá thì chặn lại', async () => {
    const http = app.getHttpServer();
    await request(http).get('/api/v1/parent/ping').expect(401);

    const unlock = await request(http)
      .post('/api/v1/parent/unlock')
      .send({ pin: process.env.SEED_PIN })
      .expect(200);
    const cookie = unlock.get('Set-Cookie')!;
    expect(cookie[0]).toMatch(/kl_parent=.+HttpOnly/);

    await request(http)
      .get('/api/v1/parent/ping')
      .set('Cookie', cookie)
      .expect(200);
    await request(http)
      .get('/api/v1/parent/status')
      .set('Cookie', cookie)
      .expect(200, { parentMode: true });

    const lock = await request(http)
      .post('/api/v1/parent/lock')
      .set('Cookie', cookie)
      .expect(200);
    const cleared = lock.get('Set-Cookie')![0].split(';')[0];
    await request(http)
      .get('/api/v1/parent/ping')
      .set('Cookie', cleared)
      .expect(401);
  });
});
