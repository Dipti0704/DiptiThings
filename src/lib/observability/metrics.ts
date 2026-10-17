import client from 'prom-client';

import { buildInfo } from '@/lib/build-info';

type Metrics = {
  registry: client.Registry;
  httpRequests: client.Counter<'route' | 'method' | 'status'>;
  httpDuration: client.Histogram<'route' | 'method' | 'status'>;
  contactSubmissions: client.Counter<'outcome'>;
  telegramDuration: client.Histogram<'outcome'>;
};

function createMetrics(): Metrics {
  const registry = new client.Registry();
  registry.setDefaultLabels({ service: 'portfolio' });
  client.collectDefaultMetrics({ register: registry });

  new client.Gauge({
    name: 'app_build_info',
    help: 'Build metadata of the running version (value is always 1)',
    labelNames: ['version', 'commit'],
    registers: [registry],
  }).set({ version: buildInfo.version, commit: buildInfo.commit }, 1);

  return {
    registry,
    httpRequests: new client.Counter({
      name: 'http_requests_total',
      help: 'API requests handled by the app',
      labelNames: ['route', 'method', 'status'],
      registers: [registry],
    }),
    httpDuration: new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'API request latency',
      labelNames: ['route', 'method', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [registry],
    }),
    contactSubmissions: new client.Counter({
      name: 'contact_submissions_total',
      help: 'Contact form submissions by outcome',
      labelNames: ['outcome'],
      registers: [registry],
    }),
    telegramDuration: new client.Histogram({
      name: 'telegram_request_duration_seconds',
      help: 'Latency of the outbound Telegram API call',
      labelNames: ['outcome'],
      buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [registry],
    }),
  };
}

// Keep one registry per process; dev-mode hot reload would otherwise
// re-register metrics and throw.
const globalForMetrics = globalThis as unknown as { __metrics?: Metrics };
export const metrics = (globalForMetrics.__metrics ??= createMetrics());

export async function observeRequest(
  route: string,
  method: string,
  handler: () => Promise<Response>,
): Promise<Response> {
  const end = metrics.httpDuration.startTimer({ route, method });
  let status = 500;
  try {
    const response = await handler();
    status = response.status;
    return response;
  } finally {
    const labels = { route, method, status: String(status) };
    end({ status: labels.status });
    metrics.httpRequests.inc(labels);
  }
}
