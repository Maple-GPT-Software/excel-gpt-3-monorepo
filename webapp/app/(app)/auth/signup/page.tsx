'use client';
import React, { useState } from 'react';
import { signInWithGoogle } from '@/service/firebase';

import Link from 'next/link';

import SimplifyApi from '@/api/SimplifyApi';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import Image from 'next/image';
import { REGISTRATION_ROUTE } from '@/constants';

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  /**
   * this function either re-directs to registration if the user signups for the first time, re-directs to the dashboard if they've already signed up or displays an error message for firebase popup errors or any unhandled errors
   */
  function signUpErrorHandler(e: any) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        /** user does not exist, re-direct to regisration */
        router.push(REGISTRATION_ROUTE);
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

  const signUpPopup = async () => {
    try {
      const { user } = await signInWithGoogle();
      const accessToken = await user.getIdToken();
      // TODO: set user profile
      await SimplifyApi(accessToken).login();

      router.push('/');
    } catch (e: any) {
      signUpErrorHandler(e);
    }
  };

  return (
    <>
      <section
        id="signup"
        className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md  bg-green-600 bg-opacity-5 py-10 px-6 font-thin dark:bg-dark sm:p-[60px]">
                <h3 className="mb-14 text-center text-2xl  text-black dark:text-white sm:text-3xl">
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
                <div className="text-body-color flex cursor-pointer select-none text-sm font-medium">
                  <span>
                    By creating account means you agree to the
                    <a href="#0" className="text-green-600 hover:underline">
                      Terms and Conditions
                    </a>
                    , and our
                    <a href="#0" className="text-green-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </div>
                <p className="text-body-color pt-11 text-center text-base font-medium">
                  Already using Startup?
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SignupPage;
