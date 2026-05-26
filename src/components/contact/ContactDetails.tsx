import { contactInfo } from '@/config/ContactInfo';
import { Mail } from 'lucide-react';
import React from 'react';

import Github from '../svgs/Github';
import LinkedIn from '../svgs/LinkedIn';

export default function ContactDetails() {
  return (
    <div className="text-muted-foreground space-y-3 text-sm">
      <p>
        <span className="text-foreground font-medium">Location:</span>{' '}
        {contactInfo.location}
      </p>
      <p className="flex items-center gap-2">
        <Mail className="size-4 shrink-0" />
        <a
          href={`mailto:${contactInfo.email}`}
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          {contactInfo.email}
        </a>
      </p>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <a
          href={contactInfo.linkedin.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <LinkedIn />
          {contactInfo.linkedin.handle}
        </a>
        <a
          href={contactInfo.github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <Github />
          github.com/{contactInfo.github.handle}
        </a>
      </div>
    </div>
  );
}
