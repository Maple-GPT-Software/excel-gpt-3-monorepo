import { freeTrialFeatureItems, premiumFeatureItems } from '@/config/marketing';
import { mdiCurrencyUsd } from '@mdi/js';
import { mdiCheck } from '@mdi/js';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import marketingLinksFactory from '@/utils/marketingLinkFactory';
import { buttonVariants } from '@/components/ui/Button';
import MDIIcon from '@/components/ui/MDIIcon';

const PricePage = () => {
  return (
    <div className="space-y-6 pb-8 pt-16">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          Start a free trial to access ExcelSimplify&apos;s features today.
          <br /> No credit card required.
        </p>
      </div>
      <div className="container flex justify-center">
        <div className="grid w-full max-w-[64rem] grid-cols-1 gap-4 md:grid-cols-3">
          {/* free trial card */}
          <div className="rounded-lg border border-solid border-slate-800 px-8 py-12">
            <h3 className="text-2xl font-medium">Free Trial</h3>
            <p className="mt-4">
              Start your <span className="font-bold">5-day</span> Free Trial
              today. No credit card required
            </p>
            <div className="my-8 flex text-3xl font-medium">
              <p>US</p>
              <MDIIcon path={mdiCurrencyUsd} size={1.5} />0
            </div>
            <Link
              href={marketingLinksFactory.freeTrialSignup}
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'w-full border-solid border-slate-800'
              )}
            >
              Get Started
            </Link>
            <ul className="mt-8 flex flex-col gap-4 text-slate-600">
              {freeTrialFeatureItems.map(item => {
                return (
                  <li className="flex gap-2" key={item}>
                    <MDIIcon path={mdiCheck} size={0.75} />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* premium subscription card */}
          <div className="rounded-lg border border-solid border-green-600 p-2 px-8 py-12">
            <h3 className="text-2xl font-medium text-green-600">Premium</h3>
            <p className="mt-4">
              For individuals that love saving hours of work.
            </p>
            <div className="my-8 flex items-end text-3xl font-medium">
              <p>US</p>
              <MDIIcon path={mdiCurrencyUsd} size={1.5} />5 &nbsp;
              <span className="text-sm font-thin"> billed monthly</span>
            </div>
            <Link
              href={marketingLinksFactory.premiumSignup}
              className={cn(
                buttonVariants({ size: 'lg', variant: 'default' }),
                'w-full border-solid border-slate-800'
              )}
            >
              Get Started
            </Link>
            <ul className="my-8 flex flex-col gap-4">
              {premiumFeatureItems.map(item => {
                return (
                  <li className="flex gap-2" key={item}>
                    <MDIIcon path={mdiCheck} size={0.75} />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-lg border border-solid border-cyan-600 p-2 py-12 px-8">
            <h3 className="text-2xl font-medium text-teal-600">Teams</h3>
            <p className="mt-4">
              For teams that need centralized billing and control. Please
              contact our sales team to discuss your needs.
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'dmt-4 w-full border-solid border-cyan-600 hover:bg-cyan-600 hover:text-white md:mt-[3.25rem]'
              )}
              href="https://docs.google.com/forms/d/e/1FAIpQLScqfwueOHIXGFRzZNeYymmqrVlqHKcL4MJ_XcfNgyw_QxeVrQ/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePage;
