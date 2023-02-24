import React from 'react';
import LandingSectionOne from '@/components/Landing/LandingSectionOne';
import LandingVideoSection from '@/components/Landing/LandingVideoSection';
import LandingFeaturesSection from '@/components/Landing/LandingFeaturesSection';
import LandingTrustedSection from '@/components/Landing/LandingTrustedSection';
import LandingReviewSection from '@/components/Landing/LandingReviewSection';
import LandingLastSection from '@/components/Landing/LandingLastSection';

export default function Home() {
  return (
    <>
      <main className="px-6 sm:px-12  md:px-20 lg:px-28">
        <div className="flex flex-col gap-10">
          <LandingSectionOne />
          <LandingVideoSection />
          <LandingFeaturesSection />
          <LandingTrustedSection />
          <LandingReviewSection />
          <LandingLastSection />
        </div>
      </main>
    </>
  );
}
