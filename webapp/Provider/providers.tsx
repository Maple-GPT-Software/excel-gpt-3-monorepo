'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ReactNode, useState } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export function Providers({ children }: ProviderProps) {
  const [queryClient] = useState(new QueryClient());
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        {children}
        {/* add production logic for initialIsOpen */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
