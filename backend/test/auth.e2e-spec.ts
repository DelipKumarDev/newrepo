import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

// Ensure env for tests
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newrepo_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test_refresh';

import { createTenantAndAdmin } from './helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let moduleRef: any;
  let refreshToken: string;

  beforeAll(async () => {
    const m = await import('../src/app.module');
    moduleRef = await Test.createTestingModule({ imports: [m.AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    const setup = await createTenantAndAdmin(moduleRef, app);
    refreshToken = setup.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('refresh token returns a new access token', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeTruthy();
  });
});