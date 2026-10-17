import { NextResponse } from 'next/server';

import { contactDeliveryConfigured } from '@/lib/contact';

export const dynamic = 'force-dynamic';

// Readiness: the pod has finished starting and its configuration is loaded.
// Missing Telegram config is reported but does not take the site out of
// rotation — the pages still work; contact failures surface in metrics/alerts.
export function GET() {
  return NextResponse.json({
    status: 'ready',
    checks: { contactDelivery: contactDeliveryConfigured() ? 'configured' : 'missing' },
  });
}
