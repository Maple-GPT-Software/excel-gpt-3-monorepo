import * as React from 'react';

import { e } from 'easy-tailwind';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={e(
        className,
        'flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 ',
        {
          disabled: 'cursor-not-allowed opacity-50',
          focus: 'outline-none ring-2 ring-slate-400 ring-offset-2',
        }
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
