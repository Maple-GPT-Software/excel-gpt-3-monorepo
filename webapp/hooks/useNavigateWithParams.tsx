import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export type Params = Partial<{
  [key in AppSearchParams]: string;
}>;

interface Options {
  preserveCurrentParms?: boolean;
  /** navigate without pushing to history stack */
  replace?: boolean;
}

/** client ride hook for routing to a new path with search params */
export const useNavigateWithParams = (options?: Options) => {
  const router = useRouter();

  const createQueryString = useCallback(
    (newParams?: Params) => {
      const params = new URLSearchParams(
        options?.preserveCurrentParms !== undefined ? location.search : ''
      );

      if (newParams !== undefined) {
        for (const key of Object.keys(newParams)) {
          // @ts-expect-error newParams[key] will always be a string
          params.set(key, newParams[key]);
        }
      }

      return params.toString();
    },
    [options]
  );

  const navigateWithParams = useCallback(
    (location: string, newParams?: Params) => {
      const searchParams = createQueryString(newParams);

      if (options?.replace === true) {
        router.replace(`${location}?${searchParams}`);
      } else {
        router.push(`${location}?${searchParams}`);
      }
    },
    [createQueryString, options, router]
  );

  return navigateWithParams;
};

export enum AppSearchParams {
  SUBSCRIPTION = 'subscription',
  REFERRER = 'referrer',
}
