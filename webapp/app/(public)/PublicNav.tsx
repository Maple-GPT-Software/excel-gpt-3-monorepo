'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { PRICING_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/constants';

const menuItems: { route: string; label: string }[] = [
  {
    route: PRICING_ROUTE,
    label: 'Pricing',
  },
];

export default function PublicNav() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const navbarToggleHandler = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  // Sticky Navbar
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar);

    return () => {
      window.removeEventListener('scroll', handleStickyNavbar);
    };
  }, []);

  return (
    <>
      <header
        className={clsx(
          'header top-0 left-0 z-40 flex w-full items-center bg-transparent ',
          {
            'dark:!bg-primary !fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition dark:!bg-opacity-20':
              sticky,
            absolute: !sticky,
          }
        )}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="max-w-full px-4 xl:mr-12">
              <Link
                data-test-id="home-link"
                href="/"
                className={`header-logo block w-full ${
                  sticky ? 'py-5 lg:py-2' : 'py-8'
                } `}
              >
                <span className="font-bold">
                  Excel<span className="text-body-color">Simplify</span>
                </span>
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  {/* TODO: MDI icon */}
                  {/* <HamburgerMenuIcon className="h-8 w-8" /> */}
                </button>
                <nav
                  id="navbarCollapse"
                  className={clsx(
                    'navbar y-4 border-gray-200 border-body-color/50 dark:border-body-color/20 absolute right-4 right-0 z-30 w-[250px] rounded border-[.5px] border-solid bg-white px-6 duration-300 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100',
                    {
                      'visibility top-full opacity-100': isNavbarOpen,
                      'invisible top-[120%] opacity-0': !isNavbarOpen,
                    }
                  )}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuItems.map(({ route, label }, index) => (
                      <li key={index} className="group relative">
                        <Link
                          href={route}
                          className={
                            'flex py-2 text-base text-dark group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:py-6 lg:px-0'
                          }
                          onClick={navbarToggleHandler}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <Link
                  href={SIGN_IN_ROUTE}
                  className="py-3 px-7 text-base  text-dark hover:opacity-70 dark:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href={SIGN_UP_ROUTE}
                  className={cn(
                    'ease-in-up rounded-md bg-green-600 px-9 py-3 text-base text-white transition  duration-300 hover:bg-opacity-90 hover:shadow-signUp'
                  )}
                >
                  Sign Up
                </Link>
                {/* <div>
                  <ThemeToggler />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
