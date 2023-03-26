import Link from 'next/link';
import type { ReactNode } from 'react';

import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/constants';

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="align-items-center flex h-16 justify-between p-8">
        <p>logo placeholder</p>
        <div>
          <Link
            className="py-2 px-6 text-base text-dark hover:opacity-70"
            href={SIGN_IN_ROUTE}
          >
            Sign in
          </Link>
          <Link
            className="rounded-md border  border-solid border-transparent bg-green-600 py-2 px-6 text-base text-white hover:border-black hover:bg-white hover:text-black"
            href={SIGN_UP_ROUTE}
          >
            Sign up
          </Link>
        </div>
      </nav>
      <section className="">{children}</section>
    </div>
  );
}

export default AuthLayout;
