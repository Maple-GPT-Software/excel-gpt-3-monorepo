import React, { ReactNode } from 'react';

function layout({ children }: { children: ReactNode }) {
  return <div className="mt-20 px-8">{children}</div>;
}

export default layout;
