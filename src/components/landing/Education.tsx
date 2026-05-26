import { education } from '@/config/Education';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Badge } from '../ui/badge';

export default function Education() {
  return (
    <Container className="mt-20">
      <SectionHeading subHeading="Background" heading="Education" />
      <div className="mt-8 flex flex-col gap-6">
        {education.map((entry) => (
          <div
            key={entry.school}
            className="border-border rounded-lg border p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{entry.school}</h3>
                <p className="text-secondary mt-1">{entry.degree}</p>
              </div>
              {entry.isCurrent ? (
                <Badge variant="secondary">{entry.endDate}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">
                  {entry.endDate}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {entry.location}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
