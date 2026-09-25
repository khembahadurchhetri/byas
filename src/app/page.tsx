import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import AboutSection from "@/components/AboutSection";
import Schemes from "@/components/Schemes";
import LatestUpdates from "@/components/LatestUpdates";
import ImportantLinks from "@/components/ImportantLinks";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f7f9fc]">
      <Hero />
      <AboutSection />
      <Schemes />
      <FeatureCards />
      <LatestUpdates />
      <ImportantLinks />
    </main>
  );
}
