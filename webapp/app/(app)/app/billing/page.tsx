'use client';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { useAuthenticatedContext } from '@/contexts/AuthProvider';
import { differenceInDays } from 'date-fns';
import React, { FunctionComponent, ReactNode, useMemo } from 'react';

function page() {
  const { simplifyUser } = useAuthenticatedContext();

  const subscriptionDaysRemaining = useMemo(() => {
    const daysRemaining = differenceInDays(simplifyUser.stripeCurrentPeriodEnd * 1000, new Date());
    return Math.max(daysRemaining, 0);
  }, [simplifyUser]);

  return (
    <div>
      <h1 className="mb-8 text-2xl">Billing</h1>

      <SectionWrapper testId="lifetime-access-wrapper">
        <div className="flex justify-between">
          <h2>Lifetime Access - Inactive</h2>
          <Button className="uppercase" variant="outline-primary">
            purchase now
          </Button>
        </div>
      </SectionWrapper>

      <SectionWrapper testId="subscription-wrapper">
        <div className="mb-2 flex justify-between">
          <h2>Subscription - Free Trial</h2>
          <p className="text-green-800">{subscriptionDaysRemaining} days left</p>
        </div>
        <p className="font-bold">Purchase your lifetime access to use AI without limitations</p>
      </SectionWrapper>

      {/* life time access dialog */}
      <Dialog open={false}>
        <DialogContent showCloseButton={true}>content here</DialogContent>
      </Dialog>
    </div>
  );
}

export default page;

const SectionWrapper: FunctionComponent<{ testId?: string; children: ReactNode }> = ({ children, testId }) => {
  return (
    <div data-test-id={testId} className="mb-4 rounded border border-solid border-green-800 p-4">
      {children}
    </div>
  );
};
