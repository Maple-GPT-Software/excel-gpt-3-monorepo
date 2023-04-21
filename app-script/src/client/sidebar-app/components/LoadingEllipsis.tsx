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

export function CenteredLoadingEllipsis({ children }: { children: ReactNode }) {
  return (
    <div className="centered-loading-ellipsis">
      <LoadingEllipsis />
      {children && <div className="children-wrapper">{children}</div>}
    </div>
  );
}
