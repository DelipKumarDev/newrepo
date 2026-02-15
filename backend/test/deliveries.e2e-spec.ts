import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
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
    // eslint-disable-next-line no-console
    console.log('test fixture tenantId=', tenantId);

    // sanity checks: ensure admin role has expected permissions and admin user has `admin` role
    const { RolesService } = await import('../src/roles/roles.service');
    const rolesService = moduleRef.get(RolesService);
    const adminRole = await rolesService.findByNames(['admin']);
    expect(adminRole.length).toBeGreaterThan(0);
    expect(adminRole[0].permissions).toContain('deliveries.create');

    const { UsersService } = await import('../src/users/users.service');
    const usersService = moduleRef.get(UsersService);
    const adminUser = await usersService.findByEmail(setup.adminEmail);
    expect(adminUser).toBeTruthy();
    const adminRoles = adminUser?.roles || [];
    expect(adminRoles).toContain('admin');

    // inspect token payload tenantId
    const { JwtService } = await import('@nestjs/jwt');
    const jwt = moduleRef.get(JwtService);
    // eslint-disable-next-line no-console
    console.log('token payload=', jwt.verify(accessToken, { secret: process.env.JWT_SECRET }));
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

  it('uploads a POD file and persists podUrl', async () => {
    // create another delivery to attach POD to
    const r = await request(app.getHttpServer())
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        tenantId,
        reference: 'E2E-POD-1',
        pickupAddress: '1 Pod St',
        dropoffAddress: '2 Pod Ave',
        distanceKm: 1,
      });

    expect(r.status).toBe(201);
    const podDeliveryId = r.body._id || r.body.id;
    // eslint-disable-next-line no-console
    console.log('created pod delivery id:', podDeliveryId, 'response body:', JSON.stringify(r.body));

    // upload a small file buffer
    const buffer = Buffer.from('pod-test-content');
    const upload = await request(app.getHttpServer())
      .post(`/api/deliveries/${podDeliveryId}/pod`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', buffer, 'pod.txt');

    expect(upload.status).toBeGreaterThanOrEqual(200);
    expect(upload.status).toBeLessThan(300);
    expect(upload.body.podUrl).toBeTruthy();

    const podUrl = upload.body.podUrl as string;
    const expectedPath = join(process.cwd(), podUrl.replace(/^[\/]/, ''));
    expect(fs.existsSync(expectedPath)).toBe(true);

    // reload delivery and ensure podUrl persisted
    const list = await request(app.getHttpServer())
      .get('/api/deliveries')
      .set('Authorization', `Bearer ${accessToken}`);

    // debug: dump list for diagnosis
    // eslint-disable-next-line no-console
    console.log('deliveries list length:', (list.body.data || []).length);
    // eslint-disable-next-line no-console
    console.log('deliveries list items:', JSON.stringify((list.body.data || []).map((d: any) => ({ id: d._id || d.id, reference: d.reference, tenantId: d.tenantId })), null, 2));

    const found = (list.body.data || []).find((d: any) => d._id === podDeliveryId || d.id === podDeliveryId);
    expect(found).toBeDefined();
    expect(found.podUrl).toBe(podUrl);

    // cleanup uploaded file
    try { fs.unlinkSync(expectedPath); } catch {};
  });
});
