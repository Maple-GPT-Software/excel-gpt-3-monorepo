'use client';

import { ReactNode } from 'react';

import 'node_modules/react-modal-video/css/modal-video.css';
import '../styles/index.css';
import Head from '@/app/Head';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en">
      <Head />

      <body className="dark:bg-black">{children}</body>
    </html>
  );
}
