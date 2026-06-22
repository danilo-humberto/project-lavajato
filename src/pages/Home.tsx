import { useRef } from "react";
import Benefits from "../components/Benefits";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ServiceSelector from "../components/ServiceSelector";
import { useLandingAnimations } from "../hooks/useLandingAnimations";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLandingAnimations(rootRef);

  return (
    <div ref={rootRef} className="min-h-screen overflow-hidden bg-[#f8fdff]">
      <Header />
      <main className="pt-20">
        <Hero />
        <Benefits />
        <ServiceSelector />
      </main>
      <Footer />
    </div>
  );
}
