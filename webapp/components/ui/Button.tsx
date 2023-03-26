import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { e } from 'easy-tailwind';

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
  {
    variants: {
      variant: {
        default: 'bg-green-600 text-white hover:bg-green-500',
        destructive: 'bg-red-500 text-white hover:bg-red-600 ',
        outline: 'bg-transparent border border-slate-200 hover:bg-slate-100',
        'outline-primary': 'bg-transparent border border-green-600 text-green-600',
        subtle: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        ghost: 'bg-transparent hover:bg-slate-100 data-[state=open]:bg-transparent',
        link: 'bg-transparent underline-offset-4 hover:underline text-slate-900 hover:bg-transparent',
        sideNav:
          'text-white !justify-start !focus:outline-none !focus:ring-0 !focus:ring-white bg-transparent border-none uppercase hover:bg-green-100/50 data-[active=true]:bg-slate-100/50 data-[active=true]:text-green-800',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <button className={e(buttonVariants({ className, variant, size }))} ref={ref} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
