'use client';

import { mdiCreditCardOutline } from '@mdi/js';
import { mdiBookOpenVariant } from '@mdi/js';
import { mdiPower } from '@mdi/js';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import colors from 'tailwindcss/colors';

import { useAuthenticatedContext } from '@/contexts/AuthProvider';

import { Button } from '@/components/ui/Button';
import MDIIcon from '@/components/ui/MDIIcon';

import { BILLING_ROUTE, DASHBOARD_ROUTE } from '@/constants';

interface SideNavItem {
  label: string;
  route: string;
  iconPath: string;
}

function SideNav() {
  const { logout } = useAuthenticatedContext();
  const sideNavTabs: SideNavItem[] = useMemo(() => {
    return [
      {
        label: 'guide',
        route: DASHBOARD_ROUTE,
        iconPath: mdiBookOpenVariant,
      },
      {
        label: 'billing',
        route: BILLING_ROUTE,
        iconPath: mdiCreditCardOutline,
      },
    ];
  }, []);

  return (
    <div className="justify-apart flex h-full w-full flex-col bg-green-800 px-4 py-12">
      <div className="h-full">
        <div className="mb-8 pl-4">
          <h2 className="text-2xl text-white">Excel Simplify</h2>
          <div className="p-4 pt-2"></div>
        </div>
        {sideNavTabs.map(tab => {
          return <SideNavItem key={tab.route} tabItem={tab} />;
        })}
      </div>
      <Button
        className="text-white hover:bg-transparent"
        variant="outline"
        onClick={logout}
      >
        <MDIIcon color={colors.white} path={mdiPower} className="mr-4" />
        logout
      </Button>
    </div>
  );
}

export default SideNav;

function SideNavItem({ tabItem }: { tabItem: SideNavItem }) {
  const { label, route, iconPath } = tabItem;
  const router = useRouter();
  const pathname = usePathname();

  const isItemActive = pathname?.includes(route);

  return (
    <Button
      className="w-full"
      variant="sideNav"
      data-active={isItemActive}
      onClick={() => {
        router.push(route);
      }}
    >
      <MDIIcon
        path={iconPath}
        className={'mr-4'}
        color={isItemActive ? colors.green[800] : colors.slate[50]}
      />
      {label}
    </Button>
  );
}
