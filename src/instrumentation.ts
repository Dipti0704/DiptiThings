import { registerOTel } from '@vercel/otel';

export function register() {
  // Tracing is opt-in: only export spans when a collector endpoint is configured.
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;
  registerOTel({ serviceName: process.env.OTEL_SERVICE_NAME ?? 'portfolio' });
}
