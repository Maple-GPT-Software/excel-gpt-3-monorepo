'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useWindowSize } from 'react-use';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/Button';
import { HOME_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/constants';

function AuthLayout({ children }: { children: ReactNode }) {
  const { width } = useWindowSize();

  if (width < 768) {
    return (
      <div className="flex h-full flex-col justify-center p-8">
        <h2 className="text-center text-2xl font-bold text-green-600">
          ExcelSimplify
        </h2>
        <Image
          src="/images/general/software_building.png"
          width={400}
          height={400}
          alt="Unavailable on mobile devices"
        />

        <p className="text-center">
          Mobile site is under construction. Please visit website on laptop or
          deskptop.
        </p>

        <Link
          className={cn(
            buttonVariants(),
            'absolute bottom-8 left-[-75px] mt-4 ml-[50%]'
          )}
          href="/"
        >
          back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-rows-[64px_1fr]">
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
      <section className="h-full w-full">{children}</section>
    </div>
  );
}

export default AuthLayout;
