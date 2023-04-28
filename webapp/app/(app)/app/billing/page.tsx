'use client';

import { differenceInDays } from 'date-fns';
import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { useAuthenticatedContext } from '@/contexts/AuthProvider';

function BillingPage() {
  const { simplifyUser } = useAuthenticatedContext();

  const subscriptionDaysRemaining = useMemo(() => {
    const daysRemaining = differenceInDays(
      simplifyUser.stripeCurrentPeriodEnd * 1000,
      new Date()
    );
    return Math.max(daysRemaining, 0);
  }, [simplifyUser]);

  return (
    <div>
      <h1 className="mb-8 text-2xl">Billing</h1>

      {/* TODO: reach out to stripe for billing information */}
      <SectionWrapper testId="subscription-wrapper">
        <div className="mb-2 flex justify-between">
          <h2>Subscription - Free Trial</h2>
          <p className="text-green-800">
            {subscriptionDaysRemaining} days left
          </p>
        </div>
        <p className="font-bold">
          Purchase your lifetime access to use AI without limitations
        </p>
      </SectionWrapper>
    </div>
  );
}

export default BillingPage;

const SectionWrapper: FunctionComponent<{
  testId?: string;
  children: ReactNode;
}> = ({ children, testId }) => {
  return (
    <div
      data-test-id={testId}
      className="mb-4 rounded border border-solid border-green-800 p-4"
    >
      {children}
    </div>
  );
};
