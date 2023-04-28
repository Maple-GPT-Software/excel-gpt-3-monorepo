import PublicFooter from './(public)/PublicFooter';
import PublicNav from './(public)/PublicNav';
import LandingFeaturesSection from '@/components/Landing/LandingFeaturesSection';
import LandingLastSection from '@/components/Landing/LandingLastSection';
import LandingReviewSection from '@/components/Landing/LandingReviewSection';
import LandingSectionOne from '@/components/Landing/LandingSectionOne';
import LandingTrustedSection from '@/components/Landing/LandingTrustedSection';
import LandingVideoSection from '@/components/Landing/LandingVideoSection';

export default function Home() {
  return (
    <>
      <PublicNav />
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
      <PublicFooter />
    </>
  );
}
