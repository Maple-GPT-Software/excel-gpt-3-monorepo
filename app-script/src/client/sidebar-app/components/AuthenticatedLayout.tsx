import React from 'react';
import Chat from '../Chat';
import { useAuthContext } from '../AuthProvider';
import * as Tooltip from '@radix-ui/react-tooltip';

import './AuthenticatedLayout.style.css';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

function AuthenticatedLayout() {
  const { signOut } = useAuthContext();

  return (
    <div className="main-laytout">
      <nav className="nav">
        {/* placeholder for hamburger menu trigger */}
        <div className="nav-left-wrapper"></div>
        <div className="nav-right-wrapper">
          <OpenGuideTooltip />
          <button onClick={signOut} className="button button-logout">
            logout
          </button>
        </div>
      </nav>
      <div className="main-content">
        <Chat />
      </div>
    </div>
  );
}

export default AuthenticatedLayout;

function OpenGuideTooltip() {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button aria-label="click to open guide" className="help-button">
            <QuestionMarkCircledIcon color="white" height={24} width={24} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent" sideOffset={5}>
            View guide
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
