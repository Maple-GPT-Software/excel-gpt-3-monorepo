import '../styles/index.css';
import { Montserrat } from '@next/font/google';
import 'node_modules/react-modal-video/css/modal-video.css';
import type { ReactNode } from 'react';

const montserrat = Montserrat({
  weight: ['100', '300', '500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

// HTML head metadata https://beta.nextjs.org/docs/api-reference/metadata
export const metadata = {
  title: 'Excel Simplify',
  description: 'Google Sheets and Microsft Excel productivity tool',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={montserrat.className}
      style={{ fontWeight: 200 }}
    >
      <body className="dark:bg-black">{children}</body>
    </html>
  );
}
