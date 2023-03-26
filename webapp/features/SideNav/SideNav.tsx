'use client';

import React, { useMemo } from 'react';
import MDIIcon from '@/components/ui/MDIIcon';
import { mdiCreditCardOutline } from '@mdi/js';
import { mdiBookOpenVariant } from '@mdi/js';

import { Button } from '@/components/ui/Button';
import { BILLING_ROUTE, DASHBOARD_ROUTE } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import colors from 'tailwindcss/colors';

interface SideNavItem {
  label: string;
  route: string;
  iconPath: string;
}

function SideNav() {
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
    <div className="flex h-full w-full flex-col bg-green-800 px-4 py-12">
      <div className="mb-8 pl-4">
        <h2 className="text-2xl text-white">Excel Simplify</h2>
        <div className="p-4 pt-2"></div>
      </div>
      {sideNavTabs.map(tab => {
        return <SideNavItem key={tab.route} tabItem={tab} />;
      })}
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
      variant="sideNav"
      data-active={isItemActive}
      onClick={() => {
        router.push(route);
      }}
    >
      <MDIIcon path={iconPath} className={'mr-4'} color={isItemActive ? colors.green[800] : colors.slate[50]} />
      {label}
    </Button>
  );
}
