import Link from 'next/link';
import type { ReactNode } from 'react';
import { HOME_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/constants';

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="align-items-center flex h-16 justify-between p-8">
        <Link className="font-bold text-green-600" href={HOME_ROUTE}>
          ExcelSimplify
        </Link>
        <div>
          <Link
            className="text-dark py-2 px-6 text-base hover:opacity-70"
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
