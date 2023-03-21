'use client';

import SimplifyApi from '@/api/SimplifyApi';
import { Button } from '@/components/ui/Button';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
import { Input } from '@/components/ui/Input';
import { BILLING_ROUTE, DASHBOARD_ROUTE } from '@/constants';
import settings from '@/settings';
import React from 'react';
import { useForm } from 'react-hook-form';

interface LifetimeAccessFormType {
  openaiApiKey: string;
}

function LifetimeAccessForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, isSubmitted },
  } = useForm<LifetimeAccessFormType>();

  async function onSubmit(data: LifetimeAccessFormType) {
    const { openaiApiKey } = data;
    const fullBillingRoute = `${settings.webappBaseUrl}/${BILLING_ROUTE}`;
    await SimplifyApi().lifetimeAccessCheckout({
      openaiApiKey,
      successUrl: fullBillingRoute,
      cancelUrl: fullBillingRoute,
    });
  }

  if (isSubmitting || isSubmitted) {
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
        <Input className="mb-8" {...register('openaiApiKey', { required: true })} />
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
      <Button disabled={!isValid} className="float-right uppercase" variant="default">
        checkout with Stripe
      </Button>
    </form>
  );
}

export default LifetimeAccessForm;
