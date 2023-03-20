'use client';

import { Input } from '@/components/ui/Input';
import React from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/Button';
import MDIIcon from '@/components/ui/MDIIcon';
import { useForm } from 'react-hook-form';

import { mdiChevronRight } from '@mdi/js';
import SimplifyApi from '@/api/SimplifyApi';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
import { useRouter, useSearchParams } from 'next/navigation';
import { DASHBOARD_ROUTE } from '@/constants';
import { AppSearchParams } from '@/hooks/useNavigateWithParams';

interface RegistrationFormTypes {
  fullName: string;
  email: string;
  hasCheckedTerms: boolean;
}
// TODO: lifetime access form
function RegistrationForm() {
  const { firebaseUser, setSimplifyUser } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitted },
  } = useForm<RegistrationFormTypes>({
    defaultValues: {
      fullName: firebaseUser?.displayName ?? '',
      email: firebaseUser?.email ?? '',
    },
  });

  async function onSubmit(data: RegistrationFormTypes) {
    const { fullName, hasCheckedTerms } = data;
    try {
      const simplifyUser = await SimplifyApi().createUser(
        fullName,
        hasCheckedTerms,
        searchParams?.get(AppSearchParams.REFERRER) ?? ''
      );

      await SimplifyApi().createFreeSubscription();

      // set user so that they are able to acces /app/* without redirect to /auth/refresh
      setSimplifyUser(simplifyUser);
      router.replace(DASHBOARD_ROUTE);
    } catch (error) {}
  }

  if (isSubmitting || isSubmitted) {
    return (
      <CenteredSpinnner>
        <p className="mt-4 text-slate-700">Setting up your account</p>
      </CenteredSpinnner>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col justify-center px-8"
    >
      <h3 className="mb-8 text-2xl font-light">Set up your account</h3>
      <div>
        <label htmlFor="fullName">
          <p>Full Name</p>
          <Input
            {...register('fullName', { required: true, minLength: 3 })}
            className="mb-4 mt-2"
          />
          {errors?.fullName?.message === 'minLength' && (
            <p role="alert">Minimum length is 3 characters</p>
          )}
        </label>
        <label htmlFor="email">
          <p>Email</p>
          <Input
            {...register('email', { required: true })}
            className="mb-4 mt-2"
            disabled
          />
          {errors.email?.type === 'required' && <p>Email is required</p>}
        </label>
      </div>
      <label
        htmlFor="checkboxLabel"
        className="text-body-color flex cursor-pointer select-none flex-col text-sm font-medium"
      >
        {/* TODO:  https://ui.shadcn.com/docs/primitives/checkbox */}
        {/* we need the checkbox to show */}
        <div>
          <input
            {...register('hasCheckedTerms', { required: true })}
            type="checkbox"
            id="checkboxLabel"
          />
          <span>
            I agree to
            <a href="#0" className="text-green-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#0" className="text-green-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </div>
        {errors?.hasCheckedTerms?.type === 'required' && (
          <p role="alert">Please accept terms before you continue.</p>
        )}
      </label>
      <Button
        className="ml-auto mt-4 w-fit"
        variant={'default'}
        disabled={!isValid}
        type="submit"
      >
        Confirm
        <MDIIcon path={mdiChevronRight} />
      </Button>
    </form>
  );
}

export default RegistrationForm;
