import { about, highlights, mySkills, skillGroups } from '@/config/About';
import Image from 'next/image';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export default function About() {
  return (
    <Container className="mt-20">
      <SectionHeading subHeading="About" heading="Me" />
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <Image
          src="/assets/avatar.png"
          alt="About"
          width={240}
          height={240}
          className="border-secondary size-60 rounded-md border-2 bg-blue-300 object-cover dark:bg-yellow-300"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold">{about.name}</h3>
          <p className="text-secondary mt-4 leading-relaxed">{about.description}</p>

          <p className="text-secondary mt-8 font-bold">Core stack</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {mySkills.map((skill) => (
              <Tooltip key={skill.key}>
                <TooltipTrigger asChild>
                  <div className="hover:bg-muted size-8 rounded-md border p-1.5 transition-colors hover:cursor-pointer">
                    {skill}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{String(skill.key)}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <p className="text-secondary mb-2 text-sm font-semibold">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ul className="text-muted-foreground mt-10 space-y-2 text-sm leading-relaxed">
            {highlights.map((item) => (
              <li key={item}>→ {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
