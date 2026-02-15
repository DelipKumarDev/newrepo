import { test, expect, request } from '@playwright/test';

// Basic e2e: create tenant+admin via backend API, login via API, navigate to UploadPod UI and perform an upload (mocked via attaching file to the form).

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

test.describe('Upload POD (UI)', () => {
  test.beforeEach(async ({ page }) => {
    // ensure frontend is reachable
    await page.goto('/login');
  });

  test('can upload POD after programmatic login', async ({ page }) => {
    // create tenant + admin via API helper endpoints used in e2e tests (reuse existing services)
    const unique = Date.now();
    const tenantRes = await request.newContext().then(ctx => ctx.post(`${API_BASE}/api/tenants`, { data: { name: `e2e-${unique}`, domain: `e2e-${unique}.local` } }));
    expect([200,201]).toContain(tenantRes.status());
    const tenantJson = await tenantRes.json();

    // register a user and login
    const email = `playwright+${unique}@example.com`;
    const pwd = 'Admin@1234';
    await request.newContext().then(ctx => ctx.post(`${API_BASE}/api/auth/register`, { data: { email, password: pwd, firstName: 'PW', lastName: 'Test', tenantId: tenantJson._id } }));

    const loginResp = await request.newContext().then(ctx => ctx.post(`${API_BASE}/api/auth/login`, { data: { email, password: pwd } }));
    expect([200,201]).toContain(loginResp.status());
    const tokens = await loginResp.json();

    // set token in localStorage then navigate to dashboard and use the UI demo-creator
    await page.addInitScript(token => {
      localStorage.setItem('accessToken', token);
    }, tokens.accessToken);

    await page.goto('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // click the demo button (creates a delivery and should redirect to /upload-pod)
    await page.click('button:has-text("Create demo delivery")');

    // wait for redirect to upload page and extract deliveryId from URL
    await page.waitForURL(/\/upload-pod\?deliveryId=.*/);
    const url = new URL(page.url());
    const deliveryId = url.searchParams.get('deliveryId');
    expect(deliveryId).toBeTruthy();

    // attach file and submit
    await page.setInputFiles('input[type=file]', [{ name: 'pod.txt', mimeType: 'text/plain', buffer: Buffer.from('playwright-pod') }]);
    await page.fill('input[placeholder="Delivery ID"]', deliveryId);
    await page.click('button:has-text("Upload POD")');

    // ensure success message appears
    await expect(page.locator('text=Uploaded — podUrl:')).toBeVisible();
  });
});
