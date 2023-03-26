'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import SimplifyApi from '@/api/SimplifyApi';

import { Button } from '@/components/ui/Button';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
import { Input } from '@/components/ui/Input';

import { BILLING_ROUTE, DASHBOARD_ROUTE } from '@/constants';

import settings from '@/settings';

interface LifetimeAccessFormType {
  openaiApiKey: string;
}

function LifetimeAccessForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, isSubmitted },
  } = useForm<LifetimeAccessFormType>();
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(data: LifetimeAccessFormType) {
    const { openaiApiKey } = data;
    const fullBillingRoute = `${settings.webappBaseUrl}/${BILLING_ROUTE}`;
    setErrorMessage('');

    try {
      await SimplifyApi().lifetimeAccessCheckout({
        openaiApiKey,
        successUrl: fullBillingRoute,
        cancelUrl: fullBillingRoute,
      });
    } catch (error) {
      let message = '';
      if (axios.isAxiosError(error)) {
        message = error.response?.data.message;
      } else {
        message = 'Internal server error. Try again';
      }

      setErrorMessage(message);
    }
  }

  if (isSubmitting || (isSubmitted && !errorMessage)) {
    return (
      <CenteredSpinnner>
        <p>Processing request</p>
      </CenteredSpinnner>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="openaiApiKey">
        <p className="mb-2">Open AI API Key</p>
        <Input
          className="mb-8"
          {...register('openaiApiKey', { required: true })}
        />
        <div className="flex">
          <p>Not sure how toget an API key?</p>
          <a className="mb-2 ml-2 text-green-600" href={DASHBOARD_ROUTE}>
            guide
          </a>
        </div>
      </label>
      <div className="mb-2 flex flex-col items-end text-xl text-slate-800">
        <p>
          $10 <span>USD</span> <span className="text-sm">+ tax</span>
        </p>
        <p className="text-sm line-through">
          $20 <span>USD</span>
        </p>
      </div>
      <div className="float-right">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <Button
          disabled={!isValid}
          className="float-right uppercase"
          variant="default"
        >
          checkout with Stripe
        </Button>
      </div>
    </form>
  );
}

export default LifetimeAccessForm;
