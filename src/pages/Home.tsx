import Benefits from "../components/Benefits";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ServiceSelector from "../components/ServiceSelector";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fdff]">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <ServiceSelector />
      </main>
      <Footer />
    </div>
  );
}
