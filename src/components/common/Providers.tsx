'use client';

import { ThemeProvider } from '@/components/common/ThemeProviders';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ViewTransitions } from 'next-view-transitions';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={0}>
          {children}
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </ThemeProvider>
    </ViewTransitions>
  );
}
