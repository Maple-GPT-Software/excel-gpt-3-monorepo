'use client';

import React, { useMemo } from 'react';
import MDIIcon from '@/components/ui/MDIIcon';
import { mdiCreditCardOutline } from '@mdi/js';
import { mdiBookOpenVariant } from '@mdi/js';

import { Button } from '@/components/ui/Button';
import { BILLING_ROUTE, DASHBOARD_ROUTE } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';

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
    <div className="px-4 py-8 w-full h-full flex flex-col">
      <div className="pl-4 mb-8">
        <h2 className="text-2xl">Dasboard</h2>
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
      <MDIIcon path={iconPath} className="mr-4" />
      {label}
    </Button>
  );
}
