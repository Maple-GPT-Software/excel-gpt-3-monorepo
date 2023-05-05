import { mdiSigma } from '@mdi/js';
import { mdiStarOutline } from '@mdi/js';
import { mdiRobotHappyOutline } from '@mdi/js';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import marketingLinksFactory from '@/utils/marketingLinkFactory';
import { buttonVariants } from '@/components/ui/Button';
import MDIIcon from '@/components/ui/MDIIcon';

export default function Home() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            The best Chat GPT integration for Google Sheets
          </h1>
          <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            Want to get more done? Boost your productivity with AI powered Chat
            GPT and delivery quality work, faster.
          </p>
          <div className="space-x-4">
            <Link
              href={marketingLinksFactory.freeTrialSignup}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-green-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className=" text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] text-center leading-normal sm:text-lg sm:leading-7">
            Wether you are trying to learn Google Sheets for the first time or
            seasoned professional, you can use chat gpt to save hours of work.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border-2 border-solid border-slate-300 bg-white p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <MDIIcon path={mdiRobotHappyOutline} size={2} />
              <div className="space-y-2">
                <h3 className="font-bold">Chat GPT</h3>
                <p className="text-sm">
                  Describe your problem. Get answers in seconds.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border-2 border-solid border-slate-300 bg-white p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <MDIIcon path={mdiSigma} size={2} />
              <div className="space-y-2">
                <h3 className="font-bold">Formulas</h3>
                <p className="text-sm">
                  Get formulas tailored to your needs. Become an instant expert.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border-2 border-solid border-slate-300 bg-white p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <MDIIcon path={mdiStarOutline} size={2} />
              <div className="space-y-2">
                <h3 className="font-bold">Simplicity</h3>
                <p className="text-sm">
                  We focus on easy to use and intuitive features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="hero-footer" className="w-full bg-green-800 py-12 md:py-24">
        <div className="container flex max-w-[48rem] flex-col items-center gap-4 bg-green-800 py-8 text-center">
          <h3 className="text-2xl text-white md:text-4xl md:leading-normal">
            Try the simplest Google Sheets Chat GPT integration
          </h3>
          <div className="mt-8 space-x-4">
            <Link
              href={marketingLinksFactory.freeTrialSignup}
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'bg-white text-slate-800'
              )}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
