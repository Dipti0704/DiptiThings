import { metrics } from '@/lib/observability/metrics';

export const dynamic = 'force-dynamic';

// Scraped by Prometheus inside the cluster; the Ingress blocks this path.
export async function GET() {
  return new Response(await metrics.registry.metrics(), {
    headers: { 'Content-Type': metrics.registry.contentType },
  });
}
