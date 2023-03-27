'use client';

// NPM
// MISC
// SERVICE
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// API
import SimplifyApi from '@/api/SimplifyApi';

// CONTEXTS
import { useAuthContext } from '@/contexts/AuthProvider';

import { signInWithGoogle } from '@/services/firebase';

import { DASHBOARD_ROUTE, SIGN_UP_ROUTE } from '@/constants';

const SigninPage = () => {
  const { setSimplifyUser } = useAuthContext();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * this function either re-directs to registration if the user signups for the first time, re-directs to the dashboard if they've already signed up or displays an error message for firebase popup errors or any unhandled errors
   */
  function signUpErrorHandler(e: any) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        /** user does not exist, re-direct to regisration */
        setErrorMessage('No account found, please sign up!');
      } else {
        console.error(e);
        setErrorMessage('Unhandled server error.');
      }
    } else if (e instanceof FirebaseError) {
      if (e.code === AuthErrorCodes.POPUP_CLOSED_BY_USER) {
        setErrorMessage('Please login using popup.');
      } else if (e.code === AuthErrorCodes.POPUP_BLOCKED) {
        setErrorMessage('Please enable popups.');
      } else {
        setErrorMessage('Error with popup');
      }
    }
  }

  const signIn = async () => {
    try {
      const { user } = await signInWithGoogle();
      const accessToken = await user.getIdToken();
      const simplifyUser = await SimplifyApi(accessToken).login();

      setSimplifyUser(simplifyUser);
      router.replace(DASHBOARD_ROUTE);
    } catch (e) {
      signUpErrorHandler(e);
    }
  };
  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md bg-green-600 bg-opacity-5 py-10 px-6 shadow-aesthetic dark:bg-dark sm:p-[60px]">
                <h3 className="mb-12 text-center text-2xl text-black dark:text-white sm:text-3xl">
                  Welcome back
                </h3>
                {errorMessage !== '' && (
                  <p className="mb-4 text-center text-red-500">
                    {errorMessage}
                  </p>
                )}
                <button
                  onClick={signIn}
                  className="text-body-color hover:text-primary dark:text-body-color mb-6 flex w-full items-center justify-center rounded-md bg-white p-3 text-base font-medium shadow-one dark:bg-[#242B51] dark:shadow-signUp dark:hover:text-white"
                >
                  <span className="mr-3">
                    <Image
                      alt="google"
                      width={16}
                      height={16}
                      src="/images/brands/google.png"
                    />
                  </span>
                  Sign in with Google
                </button>
                <p className="text-body-color text-center text-base font-medium">
                  Don’t you have an account?{' '}
                  <Link
                    href={SIGN_UP_ROUTE}
                    className="text-green-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SigninPage;
