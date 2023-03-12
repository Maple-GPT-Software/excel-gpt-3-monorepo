import { ReactNode } from 'react';
import { Montserrat } from '@next/font/google';

import 'node_modules/react-modal-video/css/modal-video.css';
import '../styles/index.css';

import Head from './head';

const montserrat = Montserrat({
  weight: ['100', '300', '500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en" className={montserrat.className} style={{ fontWeight: 200 }}>
      <Head />

      <body className="dark:bg-black">{children}</body>
    </html>
  );
}
