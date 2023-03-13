'use client';

import { Input } from '@/components/ui/Input';
import React from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/Button';
import MDIIcon from '@/components/ui/Icon';
import { useForm } from 'react-hook-form';

import { mdiChevronRight } from '@mdi/js';
import SimplifyApi from '@/api/SimplifyApi';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';

interface RegistrationFormTypes {
  fullName: string;
  email: string;
  hasCheckedTerms: boolean;
}

function RegistrationForm() {
  const { firebaseUser } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegistrationFormTypes>({
    defaultValues: {
      fullName: firebaseUser.displayName ?? '',
      email: firebaseUser.email ?? '',
    },
  });

  async function onSubmit(data: RegistrationFormTypes) {
    const { fullName, hasCheckedTerms } = data;
    try {
      // TODO : save user in auth provider
      await SimplifyApi().createUser(fullName, hasCheckedTerms);
      await SimplifyApi().createFreeSubscription();
    } catch (error) {}
  }

  if (isSubmitting) {
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
            {...(register('email'), { required: true })}
            className="mb-4 mt-2"
            disabled
            value={firebaseUser.email ?? ''}
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
        className="ml-auto mt-8 w-fit"
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
