import FeaturesSection from "@open-fpl/www/features/LandingPage/FeaturesSection";
import FindUsSection from "@open-fpl/www/features/LandingPage/FindUsSection";
import FooterSection from "@open-fpl/www/features/LandingPage/FooterSection";
import HeaderSection from "@open-fpl/www/features/LandingPage/HeaderSection";
import HeroSection from "@open-fpl/www/features/LandingPage/HeroSection";

const LandingPage = () => {
  return (
    <>
      <HeaderSection />
      <HeroSection />
      <FeaturesSection as="main" />
      <FindUsSection />
      <FooterSection as="footer" />
    </>
  );
};

export default LandingPage;
