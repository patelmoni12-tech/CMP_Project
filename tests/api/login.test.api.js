import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Login API Tests', () => {
  test('Login and access profile', async ({ request }) => {
    console.log('BASE_URL:', process.env.BASE_URL);

    const apiContext = await request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });

    const loginResponse = await apiContext.post('/login', {
      data: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      },
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    console.log('Token:', loginBody.token);
    expect(loginBody.token).toBeTruthy();

    const profileResponse = await apiContext.get('/profile', {
      headers: { Authorization: `Bearer ${loginBody.token}` },
    });

    expect(profileResponse.status()).toBe(200);
    const profileBody = await profileResponse.json();
    expect(profileBody.username).toBe(process.env.API_USERNAME);

    await apiContext.dispose();
  });
});
