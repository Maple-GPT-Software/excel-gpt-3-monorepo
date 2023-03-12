import React from 'react';
import Link from 'next/link';
import { ACCOUNT_ROUTE, DASHBOARD_ROUTE } from '@/constants';

function SideMenu() {
  return (
    <ul>
      <Link href={DASHBOARD_ROUTE}>Dashboard</Link>
      <Link href={ACCOUNT_ROUTE}>Account</Link>
    </ul>
  );
}

export default SideMenu;
