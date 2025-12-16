const { request } = require('@playwright/test');

async function createApiContext(baseURL) {
  return await request.newContext({ baseURL });
}

async function login(apiContext, username, password) {
  const response = await apiContext.post('/login', {
    data: { username, password }
  });
  const data = await response.json();
  return { status: response.status(), body: data };
}

async function getProfile(apiContext, token) {
  const response = await apiContext.get('/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return { status: response.status(), body: await response.json() };
}

module.exports = { createApiContext, login, getProfile };
