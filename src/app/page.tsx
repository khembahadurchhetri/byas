import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import AboutSection from "@/components/AboutSection";
import Schemes from "@/components/Schemes";
import LatestUpdates from "@/components/LatestUpdates";
import ImportantLinks from "@/components/ImportantLinks";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <AboutSection />
      <Schemes />
      <LatestUpdates />
      <ImportantLinks />
    </>
  );
}