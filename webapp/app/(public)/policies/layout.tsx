import { e } from 'easy-tailwind';
import React, { ReactNode } from 'react';

function layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={e('mt-24 px-4', {
        md: ['px-32'],
        lg: ['px-32'],
      })}
    >
      {children}
    </div>
  );
}

export default layout;
