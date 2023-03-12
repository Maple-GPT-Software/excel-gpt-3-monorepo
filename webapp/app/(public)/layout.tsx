import { ReactNode } from 'react';
import PublicNav from './PublicNav';
import PublicFooter from './PublicFooter';

/** layout for all public routes */
export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      <div style={{ height: '100vh', width: '100vw' }}>{children}</div>
      <PublicFooter />
    </>
  );
}
