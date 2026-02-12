import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

// Ensure env for tests so AppModule bootstrap doesn't fail
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newrepo_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test_refresh';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
