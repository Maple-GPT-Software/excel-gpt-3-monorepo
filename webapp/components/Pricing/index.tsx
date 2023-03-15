'use client';
import { SetStateAction, useState } from 'react';
import SectionTitle from '@/components/Common/SectionTitle';
import OfferList from '@/components/Pricing/OfferList';
import PricingBox from '@/components/Pricing/PricingBox';
import { useRouter } from 'next/navigation';
import { useCreateQueryString } from '@/utils/createQueryString';
import { Button } from '../ui/Button';

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const router = useRouter();

  const createQueryString = useCreateQueryString();

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Simple and Affordable Pricing"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
          width="665px"
        />
        {/* NOT NEEDED FOR NOW Monthly toggle */}
        {/* {toggleButton(setIsMonthly, isMonthly)} */}

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <PricingBox
            packageName="Free"
            price={isMonthly ? '3.99' : '120'}
            duration={isMonthly ? 'mo' : 'yr'}
            subtitle="For individuals just getting started with ExcelSimplify"
          >
            <Button variant={'subtle'} onClick={() => router && router.push('/auth/signup')}>
              Free Trial
            </Button>
            <br />
            <OfferList text="All UI Components" status="active" />
            <OfferList text="Use with Unlimited Projects" status="active" />
            <OfferList text="Commercial Use" status="active" />
            <OfferList text="Email Support" status="active" />
            <OfferList text="Lifetime Access" status="inactive" />
            <OfferList text="Free Lifetime Updates" status="inactive" />
          </PricingBox>
          <PricingBox
            packageName="Premium"
            price={isMonthly ? '4.99' : '789'}
            duration={isMonthly ? 'mo' : 'yr'}
            subtitle="Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim."
          >
            <Button
              variant={'default'}
              onClick={() => router && router.push('/auth/signup' + '?' + createQueryString('signUpSourcePremium', 'true'))}
            >
              Subscribe
            </Button>
            <br />
            <OfferList text="All UI Components" status="active" />
            <OfferList text="Use with Unlimited Projects" status="active" />
            <OfferList text="Commercial Use" status="active" />
            <OfferList text="Email Support" status="active" />
            <OfferList text="Lifetime Access" status="active" />
            <OfferList text="Free Lifetime Updates" status="inactive" />
          </PricingBox>
          <PricingBox packageName="Teams" subtitle="Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim.">
            <Button variant={'subtle'}>Contact Us</Button>
            <br />
            <OfferList text="All UI Components" status="active" />
            <OfferList text="Use with Unlimited Projects" status="active" />
            <OfferList text="Commercial Use" status="active" />
            <OfferList text="Email Support" status="active" />
            <OfferList text="Lifetime Access" status="active" />
            <OfferList text="Free Lifetime Updates" status="active" />
          </PricingBox>
        </div>
      </div>

      {svgImage()}
    </section>
  );
};

export default Pricing;

const toggleButton = (
  setIsMonthly: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  isMonthly: boolean
) => {
  return (
    <div className="w-full">
      <div className="wow fadeInUp mb-8 flex justify-center md:mb-12 lg:mb-16" data-wow-delay=".1s">
        <span
          onClick={() => setIsMonthly(true)}
          className={`${
            isMonthly ? 'text-primary pointer-events-none' : 'text-dark dark:text-white'
          } mr-4 cursor-pointer text-base font-semibold`}
        >
          Monthly
        </span>
        <div onClick={() => setIsMonthly(!isMonthly)} className="flex cursor-pointer items-center">
          <div className="relative">
            <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
            <div
              className={`${
                isMonthly ? '' : 'translate-x-full'
              } shadow-switch-1 bg-primary absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full transition`}
            >
              <span className="active h-4 w-4 rounded-full bg-white"></span>
            </div>
          </div>
        </div>
        <span
          onClick={() => setIsMonthly(false)}
          className={`${
            isMonthly ? 'text-dark dark:text-white' : 'text-primary pointer-events-none'
          } ml-4 cursor-pointer text-base font-semibold`}
        >
          Yearly
        </span>
      </div>
    </div>
  );
};

const svgImage = () => {
  return (
    <div className="absolute left-0 bottom-0 z-[-1]">
      <svg width="239" height="601" viewBox="0 0 239 601" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          opacity="0.3"
          x="-184.451"
          y="600.973"
          width="196"
          height="541.607"
          rx="2"
          transform="rotate(-128.7 -184.451 600.973)"
          fill="url(#paint0_linear_93:235)"
        />
        <rect
          opacity="0.3"
          x="-188.201"
          y="385.272"
          width="59.7544"
          height="541.607"
          rx="2"
          transform="rotate(-128.7 -188.201 385.272)"
          fill="url(#paint1_linear_93:235)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_93:235"
            x1="-90.1184"
            y1="420.414"
            x2="-90.1184"
            y2="1131.65"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4A6CF7" />
            <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_93:235"
            x1="-159.441"
            y1="204.714"
            x2="-159.441"
            y2="915.952"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4A6CF7" />
            <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
