import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Liveness: the process can serve requests. No dependency checks here, so a
// Telegram outage never causes Kubernetes to restart healthy pods.
export function GET() {
  return NextResponse.json({ status: 'ok' });
}
