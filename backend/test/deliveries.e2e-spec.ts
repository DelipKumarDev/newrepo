import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// Ensure env for tests so AppModule bootstrap doesn't fail
import { createTenantAndAdmin } from './helpers';

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newrepo_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test_refresh';

describe('Deliveries + Analytics (e2e)', () => {
  let app: INestApplication;
  let tenantId: string;
  let accessToken: string;
  let deliveryId: string;

  beforeAll(async () => {
    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    // create tenant + admin via helper and login
    const setup = await createTenantAndAdmin(moduleRef, app);
    tenantId = setup.tenantId;
    accessToken = setup.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a delivery and shows stats (delivered flow)', async () => {
    // create delivery
    const createRes = await request(app.getHttpServer())
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        tenantId,
        reference: 'E2E-REF-1',
        pickupAddress: '100 Test St',
        dropoffAddress: '200 Demo Ave',
        distanceKm: 3,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.reference).toBe('E2E-REF-1');
    deliveryId = createRes.body._id || createRes.body.id;

    // stats before marking delivered
    const stats1 = await request(app.getHttpServer())
      .get('/api/deliveries/stats')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(stats1.status).toBe(200);
    expect(stats1.body.total).toBeGreaterThanOrEqual(1);
    const deliveredBefore = Number(stats1.body.delivered || 0);

    // mark delivery as delivered
    const patch = await request(app.getHttpServer())
      .patch(`/api/deliveries/${deliveryId}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'delivered' });

    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe('delivered');
    expect(patch.body.completedAt).toBeTruthy();

    // ensure this specific delivery is now marked delivered
    const list = await request(app.getHttpServer()).get('/api/deliveries').set('Authorization', `Bearer ${accessToken}`);
    const found = (list.body.data || []).find((d: any) => d.reference === 'E2E-REF-1');
    expect(found).toBeDefined();
    expect(found.status).toBe('delivered');

    // stats should now be >= previous delivered count
    const stats2 = await request(app.getHttpServer())
      .get('/api/deliveries/stats')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(stats2.status).toBe(200);
    expect(Number(stats2.body.delivered)).toBeGreaterThanOrEqual(deliveredBefore);
  });
});
