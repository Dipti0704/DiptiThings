import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/contact/route';
import { GET as health } from '@/app/api/health/route';
import { GET as metricsRoute } from '@/app/api/metrics/route';
import { GET as ready } from '@/app/api/ready/route';
import { checkRateLimit, resetRateLimit, RATE_LIMIT_MAX_REQUESTS } from '@/lib/contact';

const valid = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+911234567890',
  message: 'Hello from the test suite',
};

function contactRequest(body: unknown, ip = '10.0.0.1') {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

beforeEach(() => resetRateLimit());
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('health endpoints', () => {
  it('liveness returns ok', async () => {
    const res = health();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('readiness reports missing contact config without failing', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    const res = ready();
    expect(res.status).toBe(200);
    expect((await res.json()).checks.contactDelivery).toBe('missing');
  });
});

describe('POST /api/contact', () => {
  it('rejects invalid payloads with 400', async () => {
    vi.stubEnv('CONTACT_DELIVERY', 'log');
    expect((await POST(contactRequest({ name: 'x' }))).status).toBe(400);
    expect((await POST(contactRequest('not json'))).status).toBe(400);
  });

  it('accepts a valid submission in log mode', async () => {
    vi.stubEnv('CONTACT_DELIVERY', 'log');
    const res = await POST(contactRequest(valid));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  it('forwards to Telegram and returns 502 when it fails', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
    vi.stubEnv('TELEGRAM_CHAT_ID', '1');
    const fetchMock = vi.fn().mockResolvedValue(new Response('bad', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(contactRequest(valid));
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(res.status).toBe(502);
  });

  it('rate limits per client IP', async () => {
    vi.stubEnv('CONTACT_DELIVERY', 'log');
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      expect((await POST(contactRequest(valid, '10.0.0.9'))).status).toBe(200);
    }
    expect((await POST(contactRequest(valid, '10.0.0.9'))).status).toBe(429);
    expect((await POST(contactRequest(valid, '10.0.0.10'))).status).toBe(200);
  });
});

describe('rate limiter window', () => {
  it('resets after the window expires', () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) checkRateLimit('ip', 0);
    expect(checkRateLimit('ip', 0).allowed).toBe(false);
    expect(checkRateLimit('ip', 61_000).allowed).toBe(true);
  });
});

describe('metrics endpoint', () => {
  it('exposes Prometheus metrics including build info', async () => {
    const body = await (await metricsRoute()).text();
    expect(body).toContain('app_build_info');
    expect(body).toContain('contact_submissions_total');
  });
});
