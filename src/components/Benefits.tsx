import { Clock, Droplet, ShieldCheck } from "lucide-react";

const benefits = [
  {
    title: "Produtos Vonixx",
    description: "Qualidade premium",
    icon: Droplet,
  },
  {
    title: "Proteção e cuidado",
    description: "Mais brilho e durabilidade",
    icon: ShieldCheck,
  },
  {
    title: "Atendimento rápido",
    description: "Seu tempo é importante",
    icon: Clock,
  },
];

export default function Benefits() {
  return (
    <section id="sobre-nos" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article
              key={benefit.title}
              className="flex items-center gap-4 rounded-3xl border border-sky-100 bg-white p-5 shadow-card"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-aqua text-white shadow-card">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">{benefit.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{benefit.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
