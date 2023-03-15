'use client';

import { ReactNode } from 'react';

import { ThemeProvider } from 'next-themes';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from '@/contexts/AuthProvider';

const queryClient = new QueryClient();

/**
 * the default layout for authenticated routes of the app
 * we wrap it with providers here since we want to ship minimal JS
 * with the public routes
 */
export default function layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        {/* https://tanstack.com/query/latest/docs/react/devtools query devtools when NODE_EV === 'production' */}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-left" panelPosition="left" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
