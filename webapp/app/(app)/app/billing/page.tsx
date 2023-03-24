'use client';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { useAuthenticatedContext } from '@/contexts/AuthProvider';
import { LifetimeAccessForm } from '@/features/billing';
import { differenceInDays } from 'date-fns';
import React, { FunctionComponent, ReactNode, useMemo } from 'react';

function BillingPage() {
  const { simplifyUser } = useAuthenticatedContext();

  const subscriptionDaysRemaining = useMemo(() => {
    const daysRemaining = differenceInDays(simplifyUser.stripeCurrentPeriodEnd * 1000, new Date());
    return Math.max(daysRemaining, 0);
  }, [simplifyUser]);

  const lifetimeAccessStatus = simplifyUser.hasLifetimeAccess ? 'Active' : 'Inactive';

  return (
    <div>
      <h1 className="mb-8 text-2xl">Billing</h1>

      <SectionWrapper testId="lifetime-access-wrapper">
        <div className="flex justify-between">
          <h2>Lifetime Access - {lifetimeAccessStatus}</h2>
          {!simplifyUser.hasLifetimeAccess && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="uppercase" variant="outline-primary">
                  purchase now
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[32rem]" showCloseButton={true}>
                <DialogHeader>
                  <DialogTitle>Lifetime Access</DialogTitle>
                  <DialogDescription className="text-slate-800">
                    Unlock lifetime access to our AI tool for Google Sheets and Excel. Upgrade your spreadsheets with this
                    lifetime offer for enhanced productivity. Get unlimited access today.
                  </DialogDescription>
                </DialogHeader>
                <LifetimeAccessForm />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </SectionWrapper>

      <SectionWrapper testId="subscription-wrapper">
        <div className="mb-2 flex justify-between">
          <h2>Subscription - Free Trial</h2>
          <p className="text-green-800">{subscriptionDaysRemaining} days left</p>
        </div>
        <p className="font-bold">Purchase your lifetime access to use AI without limitations</p>
      </SectionWrapper>
    </div>
  );
}

export default BillingPage;

const SectionWrapper: FunctionComponent<{ testId?: string; children: ReactNode }> = ({ children, testId }) => {
  return (
    <div data-test-id={testId} className="mb-4 rounded border border-solid border-green-800 p-4">
      {children}
    </div>
  );
};
