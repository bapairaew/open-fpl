import FeaturesSection from "@open-fpl/app/features/LandingPage/FeaturesSection";
import FindUsSection from "@open-fpl/app/features/LandingPage/FindUsSection";
import FooterSection from "@open-fpl/app/features/LandingPage/FooterSection";
import HeaderSection from "@open-fpl/app/features/LandingPage/HeaderSection";
import HeroSection from "@open-fpl/app/features/LandingPage/HeroSection";

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
