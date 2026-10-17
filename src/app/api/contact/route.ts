import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW,
  checkRateLimit,
  contactSchema,
  deliverContact,
} from '@/lib/contact';
import { logger } from '@/lib/observability/logger';
import { metrics, observeRequest } from '@/lib/observability/metrics';

function getClientIP(request: NextRequest): string {
  // Get IP from various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

async function handleContact(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      metrics.contactSubmissions.inc({ outcome: 'rate_limited' });
      logger.warn({ event: 'contact.rate_limited' }, 'contact rate limit hit');
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const delivered = await deliverContact(validatedData);

    if (!delivered) {
      metrics.contactSubmissions.inc({ outcome: 'delivery_failed' });
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 502 },
      );
    }

    metrics.contactSubmissions.inc({ outcome: 'delivered' });
    logger.info({ event: 'contact.accepted' }, 'contact submission delivered');
    return NextResponse.json(
      {
        message: 'Message sent successfully!',
        success: true,
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      metrics.contactSubmissions.inc({ outcome: 'invalid' });
      return NextResponse.json(
        {
          error: 'Invalid form data',
          details: error instanceof z.ZodError ? error.errors : undefined,
        },
        { status: 400 },
      );
    }

    logger.error({ event: 'contact.unhandled', err: error }, 'unhandled contact error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export function POST(request: NextRequest) {
  return observeRequest('/api/contact', 'POST', () => handleContact(request));
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
