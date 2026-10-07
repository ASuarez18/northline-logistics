
import AboutSection from "@/components/home/AboutSection";
import HeroSection from "@/components/home/HeroSection";
import PublicFooter from "@/components/home/PublicFooter";
import PublicHeader from "@/components/home/PublicHeader";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC Holding | Moving Operations Forward",
  description:
    "Reliable warehousing, distribution, and supply chain operations built to keep your business moving.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-text">
      <header id="top">
        <PublicHeader />
      </header>

      <main id="main-content">
        <section id="hero" aria-label="Introduction">
          <HeroSection />
        </section>

        <section id="company" aria-label="Company overview">
          <StatsSection />
        </section>

        <section id="services" aria-label="Our services">
          <ServicesSection />
        </section>

        <section id="about" aria-label="About ABC Holding">
          <AboutSection />
        </section>
      </main>

      <footer>
        <PublicFooter />
      </footer>
    </div>
  );
}
