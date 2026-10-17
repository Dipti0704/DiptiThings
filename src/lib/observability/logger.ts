import pino from 'pino';

import { buildInfo } from '@/lib/build-info';

// Structured JSON logs on stdout; Kubernetes collects them per container.
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: 'portfolio',
    version: buildInfo.version,
    commit: buildInfo.commit,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['email', 'phone', 'message', '*.email', '*.phone', '*.message'],
});
