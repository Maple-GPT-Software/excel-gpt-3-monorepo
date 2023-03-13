import type { ReactNode } from 'react';

function CenteredSpinnner({ children }: { children?: ReactNode | null }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div
        className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-green-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      {children}
    </div>
  );
}

export default CenteredSpinnner;
