import { heroConfig, skillComponents, socialLinks } from '@/config/Hero';
import { parseTemplate } from '@/lib/hero';
import { cn } from '@/lib/utils';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React from 'react';

import Container from '../common/Container';
import Skill from '../common/Skill';
import CV from '../svgs/CV';
import Chat from '../svgs/Chat';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const buttonIcons = {
  CV: CV,
  Chat: Chat,
};

export default function Hero() {
  const { name, title, avatar, skills, description, buttons, tagline, location } =
    heroConfig as typeof heroConfig & { tagline?: string; location?: string };

  const renderDescription = () => {
    const parts = parseTemplate(description.template, skills);

    return parts.map((part) => {
      if (part.type === 'skill' && 'skill' in part && part.skill) {
        const SkillComponent =
          skillComponents[part.skill.component as keyof typeof skillComponents];
        return (
          <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
            <SkillComponent />
          </Skill>
        );
      }
      if (part.type === 'bold' && 'text' in part) {
        return (
          <b key={part.key} className="text-primary whitespace-pre-wrap">
            {part.text}
          </b>
        );
      }
      if (part.type === 'text' && 'text' in part) {
        return (
          <span key={part.key} className="whitespace-pre-wrap">
            {part.text}
          </span>
        );
      }
      return null;
    });
  };

  return (
    <Container className="mx-auto max-w-5xl">
      <Image
        src={avatar}
        alt="hero"
        width={100}
        height={100}
        className="size-24 rounded-full bg-blue-300 object-cover dark:bg-yellow-300"
      />

      <div className="mt-8 flex flex-col gap-2">
        <h1 className="text-4xl font-bold md:text-5xl">
          Hi, I&apos;m {name} — <span className="text-secondary">{title}</span>
        </h1>

        {location ? (
          <p className="text-muted-foreground text-sm">{location}</p>
        ) : null}

        {tagline ? (
          <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-relaxed md:text-lg">
            {tagline}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-base whitespace-pre-wrap text-neutral-500 md:text-lg">
          {renderDescription()}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {buttons.map((button, index) => {
          const IconComponent =
            buttonIcons[button.icon as keyof typeof buttonIcons];
          return (
            <Button
              key={index}
              variant={button.variant as 'outline' | 'default'}
              className={cn(
                button.variant === 'outline' && 'inset-shadow-indigo-500',
                button.variant === 'default' && 'inset-shadow-indigo-500',
              )}
            >
              {IconComponent && <IconComponent />}
              {button.href.startsWith('http') ? (
                <a
                  href={button.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {button.text}
                </a>
              ) : (
                <Link href={button.href}>{button.text}</Link>
              )}
            </Button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-2">
        {socialLinks.map((link) => (
          <Tooltip key={link.name} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className="text-secondary flex items-center gap-2"
              >
                <span className="size-6">{link.icon}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Container>
  );
}
