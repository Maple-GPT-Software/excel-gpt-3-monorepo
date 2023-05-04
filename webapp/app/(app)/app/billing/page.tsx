'use client';

import { premiumFeatureItems } from '@/config/marketing';
import { mdiCheck } from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';
import React, { useMemo } from 'react';
import SimplifyApi from '@/api/SimplifyApi';
import { useAuthenticatedContext } from '@/contexts/AuthProvider';
import { cn } from '@/utils/cn';
import { Button, buttonVariants } from '@/components/ui/Button';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
import MDIIcon from '@/components/ui/MDIIcon';
import { SimplifyUser } from '@/types/simplifyApi';
import { BILLING_ROUTE, DASHBOARD_ROUTE } from '@/constants';
import settings from '@/settings';

function BillingPageWrapper() {
  const { simplifyUser, setSimplifyUser } = useAuthenticatedContext();

  // re-fetch profile if stripeCurrentPeriodEnd is not defined
  // this is the case for first login after signing up
  const { isLoading } = useQuery(
    ['profile'],
    () => {
      return SimplifyApi().login();
    },
    {
      enabled: simplifyUser.stripeCurrentPeriodEnd === undefined,
      onSuccess: data => {
        setSimplifyUser(data);
      },
    }
  );

  if (isLoading && simplifyUser.stripeCurrentPeriodEnd === undefined) {
    return (
      <CenteredSpinnner>
        <p>Loading your subscription</p>
      </CenteredSpinnner>
    );
  }

  return <BillingPage user={simplifyUser} />;
}

function BillingPage({ user }: { user: SimplifyUser }) {
  const subscriptionDaysRemaining = useMemo(() => {
    const daysRemaining = differenceInDays(
      user.stripeCurrentPeriodEnd * 1000,
      new Date()
    );
    return Math.max(daysRemaining, 0);
  }, [user]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Billing</h1>
      <p className="mb-8 text-slate-600">
        Manage billing and your subscription plan
      </p>

      {user.stripeStatus === 'trialing' && (
        <FreeTrialCard user={user} daysRemaining={subscriptionDaysRemaining} />
      )}

      {user.stripeStatus === 'active' && (
        <PremiumSubscriptionCard
          user={user}
          daysRemaining={subscriptionDaysRemaining}
        />
      )}

      {user.stripeStatus === 'canceled' && (
        <ActivateSubscriptionCard daysRemaining={subscriptionDaysRemaining} />
      )}
    </div>
  );
}

export default BillingPageWrapper;

interface SubscriptionCardProps {
  user: SimplifyUser;
  daysRemaining: number;
}

function FreeTrialCard({ user, daysRemaining }: SubscriptionCardProps) {
  return (
    <div className="free-trial-card rounded border border-solid border-slate-500 p-4">
      <p className="font-bold"> Subscription Plan </p>
      <p className="text-slate-600">
        You are currently on a <span className="text-bold">Free Trial</span>.{' '}
        <span className="text-bold text-orange-500">{daysRemaining}</span> days
        left.
      </p>
      <a
        className={cn(buttonVariants(), 'mt-8')}
        href={settings.stripeCustomerPortalUrl}
      >
        Upgrade to Premium
      </a>
    </div>
  );
}

function PremiumSubscriptionCard({
  user,
  daysRemaining,
}: SubscriptionCardProps) {
  return (
    <div className="free-trial-card rounded border border-solid border-slate-500 p-4">
      <p className="font-bold"> Subscription Plan </p>
      <p className="text-slate-600">
        You are currently on a <span className="text-bold">Premium</span> plan.{' '}
        <span className="text-bold text-green-600">{daysRemaining}</span> days
        until next bill.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {premiumFeatureItems.map(item => {
          return (
            <div className="flex gap-2" key={item}>
              <MDIIcon path={mdiCheck} size={0.75} />
              <p>{item}</p>
            </div>
          );
        })}
      </div>
      <a
        className={cn(buttonVariants(), 'mt-8')}
        href={settings.stripeCustomerPortalUrl}
      >
        Manage Subscription
      </a>
    </div>
  );
}

function ActivateSubscriptionCard({
  daysRemaining,
}: {
  daysRemaining: number;
}) {
  async function startPremiumCheckout() {
    await SimplifyApi().createCheckoutSession({
      priceId: settings.stripePriceIds.premiumMonthly,
      successUrl: `${settings.webappBaseUrl}/${DASHBOARD_ROUTE}`,
      cancelUrl: `${settings.webappBaseUrl}/${BILLING_ROUTE}`,
    });
  }

  return (
    <div className="free-trial-card rounded border border-solid border-slate-500 p-4">
      <p className="font-bold"> Subscription Plan </p>
      <p className="text-slate-600">You do not have an active subscription</p>
      {daysRemaining > 0 && (
        <p className="mt-4">
          You can still use our apps for{' '}
          <span className="text-bold text-green-600">{daysRemaining}</span> days
        </p>
      )}
      <Button
        onClick={startPremiumCheckout}
        className={cn(buttonVariants(), 'mt-8')}
      >
        Activate Premium Subscription
      </Button>
    </div>
  );
}
