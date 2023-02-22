import LandingFeaturesSection from "@/components/Landing/LandingFeaturesSection";
import LandingLastSection from "@/components/Landing/LandingLastSection";
import LandingReviewSection from "@/components/Landing/LandingReviewSection";
import LandingSectionOne from "@/components/Landing/LandingSectionOne";
import LandingTrustedSection from "@/components/Landing/LandingTrustedSection";
import LandingVideoSection from "@/components/Landing/LandingVideoSection";

const Home = () => {
  return (
    <div className="flex flex-col gap-10">
      <LandingSectionOne />
      <LandingVideoSection />
      <LandingFeaturesSection />
      <LandingTrustedSection />
      <LandingReviewSection />
      <LandingLastSection />
    </div>
  );
};

export default Home;
