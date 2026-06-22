import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BadgeCheck, Car, ClipboardList, Droplet, Info, Lock, Send, ShieldCheck, Users } from "lucide-react";
import type { ExtraService } from "../types/service";
import { prefersReducedMotion } from "../utils/animation";
import { formatCurrency } from "../utils/order";

type OrderSummaryProps = {
  carSizeLabel: string;
  washTypeLabel: string;
  washPrice: number;
  selectedExtras: ExtraService[];
  total: number;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
};

const highlights = [
  {
    title: "Produtos premium",
    description: "Utilizamos produtos Vonixx de alta qualidade.",
    icon: Droplet,
  },
  {
    title: "Profissionais qualificados",
    description: "Equipe treinada para cuidar do seu carro.",
    icon: Users,
  },
  {
    title: "Satisfação garantida",
    description: "Seu carro limpo ou a gente faz de novo.",
    icon: ShieldCheck,
  },
];

export default function OrderSummary({
  carSizeLabel,
  washTypeLabel,
  washPrice,
  selectedExtras,
  total,
  isSubmitting,
  submitError,
  onSubmit,
}: OrderSummaryProps) {
  const totalRef = useRef<HTMLParagraphElement>(null);
  const isFirstTotalRender = useRef(true);

  useEffect(() => {
    const totalElement = totalRef.current;

    if (!totalElement || prefersReducedMotion()) {
      return;
    }

    if (isFirstTotalRender.current) {
      isFirstTotalRender.current = false;
      return;
    }

    gsap.fromTo(
      totalElement,
      { y: -5, scale: 0.98, autoAlpha: 0.58 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      },
    );

    return () => {
      gsap.killTweensOf(totalElement);
    };
  }, [total]);

  return (
    <div className="space-y-5">
      <aside
        data-animate="order-summary"
        className="rounded-3xl border border-sky-100 bg-white p-5 shadow-soft sm:p-6"
        aria-labelledby="order-summary-title"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
            <ClipboardList className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h2 id="order-summary-title" className="text-xl font-black text-ink">
              Resumo do pedido
            </h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-ocean to-aqua" />
          </div>
        </div>

        <div className="mt-6 space-y-5 border-t border-sky-100 pt-5 text-sm">
          <div>
            <p className="text-slate-500">Tamanho do carro</p>
            <p className="mt-2 flex items-center gap-2 font-extrabold text-ink">
              <Car className="h-5 w-5 text-ocean" aria-hidden="true" />
              {carSizeLabel}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Serviço selecionado</p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <p className="flex items-center gap-2 font-extrabold text-ink">
                <BadgeCheck className="h-5 w-5 text-ocean" aria-hidden="true" />
                {washTypeLabel}
              </p>
              <p className="whitespace-nowrap font-black text-ink">{formatCurrency(washPrice)}</p>
            </div>
          </div>

          <div>
            <p className="text-slate-500">Serviços extras</p>
            {selectedExtras.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {selectedExtras.map((extra) => (
                  <li key={extra.id} className="flex items-start justify-between gap-3 font-semibold text-ink">
                    <span>{extra.title}</span>
                    <span className="whitespace-nowrap">{formatCurrency(extra.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 font-semibold text-ink">Nenhum selecionado</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-sky-100 pt-5">
          <p className="text-xl font-black text-ink">Total</p>
          <p ref={totalRef} className="text-3xl font-black text-ocean">
            {formatCurrency(total)}
          </p>
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl bg-sky-50 p-4 text-sm leading-5 text-slate-600">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-ocean" aria-hidden="true" />
          <p>O valor pode variar de acordo com o estado do veículo.</p>
        </div>

        {submitError ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700" role="alert">
            {submitError}
          </div>
        ) : null}

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-aqua to-ocean px-6 text-base font-black text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-card"
        >
          {isSubmitting ? "Enviando pedido..." : "Solicitar serviço"}
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Seus dados estão seguros conosco.
        </p>
      </aside>

      <aside className="rounded-3xl border border-sky-100 bg-white p-5 shadow-card sm:p-6" aria-label="Diferenciais Lava+">
        <div className="space-y-5">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <div key={highlight.title} className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-ink">{highlight.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{highlight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
