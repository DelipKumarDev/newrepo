import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

// Ensure env for tests
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newrepo_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test_refresh';

import { createTenantAndAdmin, promoteToSuperAdmin } from './helpers';

describe('Payouts (e2e)', () => {
  let app: INestApplication;
  let moduleRef: any;
  let tenantId: string;
  let adminToken: string;

  beforeAll(async () => {
    const m = await import('../src/app.module');
    moduleRef = await Test.createTestingModule({ imports: [m.AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    const s = await createTenantAndAdmin(moduleRef, app, { adminEmail: 'payout-admin@example.com' });
    tenantId = s.tenantId;
    adminToken = s.accessToken;

    // create & deliver two deliveries so payout has data
    await request(app.getHttpServer()).post('/api/deliveries').set('Authorization', `Bearer ${adminToken}`).send({ tenantId, reference: 'P-1', pickupAddress: 'A', dropoffAddress: 'B', distanceKm: 2 });
    const d2 = await request(app.getHttpServer()).post('/api/deliveries').set('Authorization', `Bearer ${adminToken}`).send({ tenantId, reference: 'P-2', pickupAddress: 'A2', dropoffAddress: 'B2', distanceKm: 4 });

    // mark both delivered
    await request(app.getHttpServer()).patch(`/api/deliveries/${d2.body._id || d2.body.id}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'delivered' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('generates, approves and marks payout as paid', async () => {
    const periodStart = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    const periodEnd = new Date().toISOString();

    const gen = await request(app.getHttpServer()).post('/api/payouts/generate').set('Authorization', `Bearer ${adminToken}`).send({ periodStart, periodEnd });
    expect(gen.status).toBe(201);
    const payoutId = gen.body._id || gen.body.id;
    expect(gen.body.grossAmount).toBeGreaterThanOrEqual(0);

    // promote admin to super-admin to approve
    await promoteToSuperAdmin(moduleRef, 'payout-admin@example.com');
    const login = await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'payout-admin@example.com', password: 'Admin@1234' });
    const superToken = login.body.accessToken;

    const approve = await request(app.getHttpServer()).patch(`/api/payouts/${payoutId}/approve`).set('Authorization', `Bearer ${superToken}`).send();
    expect(approve.status).toBe(200);
    expect(approve.body.status).toBe('approved');

    const paid = await request(app.getHttpServer()).patch(`/api/payouts/${payoutId}/paid`).set('Authorization', `Bearer ${adminToken}`).send();
    expect(paid.status).toBe(200);
    expect(paid.body.status).toBe('paid');

    const list = await request(app.getHttpServer()).get('/api/payouts').set('Authorization', `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});