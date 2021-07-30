import FeaturesSection from "@open-fpl/www/features/LandingPage/FeaturesSection";
import FindUsSection from "@open-fpl/www/features/LandingPage/FindUsSection";
import FooterSection from "@open-fpl/www/features/LandingPage/FooterSection";
import HeaderSection from "@open-fpl/www/features/LandingPage/HeaderSection";
import HeroSection from "@open-fpl/www/features/LandingPage/HeroSection";

const LandingPage = () => (
  <>
    <HeaderSection />
    <HeroSection bgGradient="linear(to-b, white, gray.50, gray.50)" />
    <FeaturesSection bg="gray.50" as="main" />
    <FindUsSection />
    <FooterSection as="footer" />
  </>
);

// Find us - Twitter, Github

export default LandingPage;
