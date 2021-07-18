import FeaturesSection from "~/features/LandingPage/FeaturesSection";
import FindUsSection from "~/features/LandingPage/FindUsSection";
import FooterSection from "~/features/LandingPage/FooterSection";
import HeaderSection from "~/features/LandingPage/HeaderSection";
import HeroSection from "~/features/LandingPage/HeroSection";

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
