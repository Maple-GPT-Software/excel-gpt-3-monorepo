'use client';

import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import SimplifyApi from '@/api/SimplifyApi';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useNavigateWithParams } from '@/hooks/useNavigateWithParams';
import { signInWithGoogle } from '@/services/firebase';
import {
  RegistrationParamKeys,
  RegistrationParamValues,
} from '@/types/appTypes';
import {
  REGISTRATION_ROUTE,
  DASHBOARD_ROUTE,
  SIGN_IN_ROUTE,
  TERMS_AND_CONDITIONS,
  PRIVATE_POLICIES,
} from '@/constants';

const SignupPage = () => {
  const { setSimplifyUser } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const navigateWithParams = useNavigateWithParams({
    preserveCurrentParms: true,
    replace: true,
  });

  /**
   * this function either re-directs to registration if the user signups for the first time, re-directs to the dashboard if they've already signed up or displays an error message for firebase popup errors or any unhandled errors
   */
  function signUpErrorHandler(e: any) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        /** user does not exist, re-direct to regisration */
        navigateWithParams(REGISTRATION_ROUTE);
      } else {
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

  // TODO: check if user has stripCustomerId
  const signUpPopup = async () => {
    try {
      const { user } = await signInWithGoogle();
      const accessToken = await user.getIdToken();
      const response = await SimplifyApi(accessToken).login();

      setSimplifyUser(response);
      navigateWithParams(DASHBOARD_ROUTE);
    } catch (e: any) {
      signUpErrorHandler(e);
    }
  };

  const subscriptionType = searchParams?.get(
    RegistrationParamKeys.SUBSCRIPTION
  );

  return (
    <>
      <section
        id="signup"
        className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden"
      >
        {(!subscriptionType ||
          subscriptionType !== RegistrationParamValues.PREMIUM) && (
          <div className="mb-[5rem] text-center">
            <h2 className="text-3xl font-normal">Start your free trial</h2>
            <p>
              No Credit card required.
              <span className="text-green-600"> 5 days free</span>
            </p>
          </div>
        )}
        <div className="container">
          <div className="flex flex-wrap">
            <div className="-mt-8 w-full px-4">
              <div className="dark:bg-dark mx-auto max-w-[500px] rounded-md  bg-green-600 bg-opacity-5 p-6 font-thin shadow-aesthetic sm:p-[40px]">
                <h3 className="mb-8 text-center text-2xl  text-black dark:text-white sm:text-3xl">
                  Create your account
                </h3>
                {errorMessage !== '' && (
                  <p className="mb-4 text-center text-red-500">
                    {errorMessage}
                  </p>
                )}
                <button
                  onClick={signUpPopup}
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
                  Sign up with Google
                </button>
                <div className="text-body-color flex cursor-pointer select-none text-center text-sm font-medium">
                  <span>
                    By signing up, I agree to the ExcelSimplify{' '}
                    <Link
                      href={TERMS_AND_CONDITIONS}
                      className="text-green-600 hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                    , and{' '}
                    <Link
                      href={PRIVATE_POLICIES}
                      className="text-green-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>
                <p className="text-body-color pt-11 text-center text-base font-medium">
                  Already have an account?{' '}
                  <Link
                    href={SIGN_IN_ROUTE}
                    className="text-green-600 hover:underline"
                  >
                    Sign in
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

export default SignupPage;
