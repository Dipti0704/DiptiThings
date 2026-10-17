import { trace } from '@opentelemetry/api';
import client from 'prom-client';
import * as z from 'zod';

import { logger } from '@/lib/observability/logger';
import { metrics } from '@/lib/observability/metrics';

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  message: z.string().min(10).max(1000),
});

export type ContactData = z.infer<typeof contactSchema>;

export const RATE_LIMIT_WINDOW = 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 5;
const TELEGRAM_TIMEOUT_MS = 5000;

// In-memory, so each replica keeps its own counters. Acceptable for a
// portfolio; a shared store (e.g. Redis) would be needed for a strict limit.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  clientIP: string,
  now = Date.now(),
): { allowed: boolean; remaining: number } {
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count };
}

export function resetRateLimit() {
  rateLimitStore.clear();
}

// "telegram" (default) forwards to the bot; "log" only records the submission,
// which lets CI smoke tests exercise the full journey without a real token.
function deliveryMode() {
  return process.env.CONTACT_DELIVERY === 'log' ? 'log' : 'telegram';
}

export function contactDeliveryConfigured(): boolean {
  return (
    deliveryMode() === 'log' ||
    Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
  );
}

// Evaluated on every scrape so a missing secret is alertable, not just
// visible in /api/ready.
if (!metrics.registry.getSingleMetric('contact_delivery_configured')) {
  new client.Gauge({
    name: 'contact_delivery_configured',
    help: '1 when contact delivery has the configuration it needs, else 0',
    registers: [metrics.registry],
    collect() {
      this.set(contactDeliveryConfigured() ? 1 : 0);
    },
  });
}

function formatMessage(data: ContactData) {
  return `
🔔 *New Contact Form Submission*

👤 *Name:* ${data.name.trim()}
📧 *Email:* ${data.email.trim()}
📱 *Phone:* ${data.phone.trim()}

💬 *Message:*
${data.message.trim()}

⏰ *Submitted:* ${new Date().toISOString()}
  `.trim();
}

export async function deliverContact(data: ContactData): Promise<boolean> {
  if (deliveryMode() === 'log') {
    logger.info({ event: 'contact.delivered', mode: 'log' }, 'contact submission recorded');
    return true;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    logger.error({ event: 'contact.misconfigured' }, 'Telegram credentials not configured');
    return false;
  }

  const apiBase = process.env.TELEGRAM_API_URL ?? 'https://api.telegram.org';
  const end = metrics.telegramDuration.startTimer();
  const tracer = trace.getTracer('portfolio');

  return tracer.startActiveSpan('telegram.sendMessage', async (span) => {
    try {
      const response = await fetch(`${apiBase}/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: formatMessage(data), parse_mode: 'Markdown' }),
        signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      });
      span.setAttribute('http.response.status_code', response.status);

      if (!response.ok) {
        end({ outcome: 'error' });
        logger.error(
          { event: 'contact.telegram_error', status: response.status },
          'Telegram API rejected the message',
        );
        span.setStatus({ code: 2 });
        return false;
      }
      end({ outcome: 'success' });
      return true;
    } catch (error) {
      end({ outcome: 'error' });
      logger.error({ event: 'contact.telegram_unreachable', err: error }, 'Telegram API unreachable');
      span.recordException(error as Error);
      span.setStatus({ code: 2 });
      return false;
    } finally {
      span.end();
    }
  });
}
