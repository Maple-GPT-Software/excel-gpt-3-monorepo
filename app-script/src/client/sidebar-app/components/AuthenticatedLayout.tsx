import React, { useState } from 'react';
import Chat from '../Chat';
import { useAuthContext } from '../AuthProvider';
import { SubscriptionStatuses } from '../api/SimplifyApi';

import './AuthenticatedLayout.style.css';
import Menu from './Menu/Menu';
import { SWRConfig } from 'swr';

function AuthenticatedLayout() {
  const { userProfile } = useAuthContext();
  if (!userProfile) {
    return null;
  }

  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <div className="main-laytout">
        <Menu />
        <div className="main-content">
          <Chat />
        </div>
      </div>
    </SWRConfig>
  );
}

export default AuthenticatedLayout;
