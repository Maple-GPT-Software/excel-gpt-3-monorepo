import PublicFooter from './PublicFooter';
import PublicNav from './PublicNav';
import { ReactNode } from 'react';

/** layout for all public routes */
export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen w-screen pt-14">{children}</main>
      <PublicFooter />
    </>
  );
}
