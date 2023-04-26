import React, { ReactNode } from 'react';

import './LoadingEllipsis.style.css';

function LoadingEllipsis() {
  return (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingEllipsis;

export function CenteredLoadingEllipsis({
  children,
  darkMode = false,
}: {
  children: ReactNode;
  darkMode?: boolean;
}) {
  return (
    <div className={`centered-loading-ellipsis ${darkMode ? 'dark-mode' : ''}`}>
      <LoadingEllipsis />
      {children && <div className="children-wrapper">{children}</div>}
    </div>
  );
}
