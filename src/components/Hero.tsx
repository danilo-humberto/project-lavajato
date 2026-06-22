import { ArrowRight, CalendarCheck } from "lucide-react";
import { scrollToSection } from "../utils/animation";

export default function Hero() {
  return (
    <section id="inicio" className="px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate min-h-[620px] overflow-hidden rounded-[2rem] bg-mist shadow-soft md:min-h-[540px]">
          <img
            data-animate="hero-image"
            src="/hero-car-wash.png"
            alt="Carro azul recém-lavado com água e espuma"
            className="absolute inset-0 h-full w-full object-cover object-[63%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/78 to-sky-100/50 md:bg-gradient-to-r md:from-white md:via-white/80 md:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sky-100/90 to-transparent" />

          <span className="absolute left-[48%] top-10 h-12 w-12 rounded-full border border-white/70 bg-white/15 shadow-inner" aria-hidden="true" />
          <span className="absolute right-16 top-16 h-5 w-5 rounded-full border border-white/80 bg-white/20 shadow-inner" aria-hidden="true" />
          <span className="absolute right-1/3 top-32 h-8 w-8 rounded-full border border-white/70 bg-white/15 shadow-inner" aria-hidden="true" />

          <div className="relative z-10 flex min-h-[620px] items-center px-6 py-14 sm:px-10 md:min-h-[540px] lg:px-14">
            <div className="max-w-xl">
              <p
                data-animate="hero-eyebrow"
                className="mb-4 inline-flex rounded-full border border-cyan-200 bg-white/75 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-ocean shadow-card"
              >
                Lavajato premium
              </p>
              <h1 data-animate="hero-title" className="text-4xl font-black leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
                Seu carro{" "}
                <span className="text-ocean">limpo, protegido e brilhando como novo!</span>
              </h1>
              <p data-animate="hero-description" className="mt-6 max-w-lg text-lg leading-8 text-slate-700">
                Lavagens profissionais com produtos Vonixx, acabamento de qualidade e atendimento rápido.
              </p>
              <span data-animate="hero-button" className="mt-8 inline-flex">
                <a
                  href="#servicos"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection("servicos");
                  }}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-aqua to-ocean px-7 text-base font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  Agendar lavagem
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
