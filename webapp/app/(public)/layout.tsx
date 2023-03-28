import PublicFooter from './PublicFooter';
import PublicNav from './PublicNav';
import { ReactNode } from 'react';

/** layout for all public routes */
export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      <div style={{ minHeight: '100vh', width: '100vw' }}>{children}</div>
      <PublicFooter />
    </>
  );
}
