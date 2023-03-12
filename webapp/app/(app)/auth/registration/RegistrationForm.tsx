'use client';

import { Input } from '@/components/ui/Input';
import React, { useRef, useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/Button';
import MDIIcon from '@/components/ui/Icon';

import { mdiChevronRight } from '@mdi/js';
import { mdiCheck } from '@mdi/js';

function RegistrationForm() {
  const { firebaseUser } = useAuthContext();
  const [isLoading, setShowLoading] = useState();
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.value = firebaseUser.displayName ?? '';
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex h-full flex-col justify-center px-8">
      <h3 className="mb-8 text-2xl font-light">Set up your account</h3>
      <div>
        <label htmlFor="name">
          <p>Full Name</p>
          <Input ref={nameInputRef} id="name" className="mb-4 mt-2" />
        </label>
        <label htmlFor="email">
          <p>Email</p>
          <Input className="mb-4 mt-2" id="email" disabled value={firebaseUser.email ?? ''} />
        </label>
      </div>
      <label htmlFor="checkboxLabel" className="text-body-color flex cursor-pointer select-none text-sm font-medium">
        {/* TODO:  https://ui.shadcn.com/docs/primitives/checkbox */}
        {/* we need the checkbox to show */}
        <div className="relative">
          <input type="checkbox" id="checkboxLabel" className="sr-only" />
          <div className="box border-body-color flex h-5 w-5 items-center justify-center rounded border border-opacity-20 dark:border-white dark:border-opacity-10">
            <span className="rounded border border-solid border-slate-500 opacity-0">
              <MDIIcon className="fill-green" path={mdiCheck} size={0.5} />
            </span>
          </div>
        </div>
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
      </label>
      <Button className="ml-auto mt-8 w-fit" variant={'default'}>
        Confirm
        <MDIIcon path={mdiChevronRight} />
      </Button>
    </div>
  );
}

export default RegistrationForm;
