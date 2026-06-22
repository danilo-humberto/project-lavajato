import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckCircle2, Copy, RotateCcw, Route } from "lucide-react";
import { prefersReducedMotion } from "../utils/animation";

type OrderSuccessModalProps = {
  trackingCode: string;
  onCreateAnother: () => void;
};

export default function OrderSuccessModal({ trackingCode, onCreateAnother }: OrderSuccessModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trackingLink = `/acompanhamento/${trackingCode}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const card = cardRef.current;

    if (!overlay || !card || prefersReducedMotion()) {
      return () => {
        document.body.style.overflow = "";
      };
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 })
      .fromTo(card, { y: 28, scale: 0.98, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.42 }, "-=0.12");

    return () => {
      timeline.kill();
      document.body.style.overflow = "";
    };
  }, []);

  function handleTrackOrder() {
    window.location.href = trackingLink;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
    >
      <div ref={cardRef} className="w-full max-w-lg rounded-[2rem] border border-sky-100 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-ocean">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-ocean">Agendamento recebido</p>
            <h2 id="order-success-title" className="mt-1 text-2xl font-black leading-tight text-ink">
              Pedido enviado com sucesso!
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          Seu serviço foi enviado para o lavajato. Guarde o código abaixo para acompanhar o andamento.
        </p>

        <div className="mt-6 rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50 p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Código de acompanhamento</p>
          <p className="mt-2 text-3xl font-black tracking-wide text-ocean">{trackingCode}</p>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sky-50 p-4 text-sm font-bold text-ink">
          <Copy className="h-5 w-5 shrink-0 text-ocean" aria-hidden="true" />
          <span className="break-all">{trackingLink}</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCreateAnother}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 py-3 text-sm font-black text-ink shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-cyan-200"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Realizar outro agendamento
          </button>
          <button
            type="button"
            onClick={handleTrackOrder}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-aqua to-ocean px-5 py-3 text-sm font-black text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-cyan-200"
          >
            <Route className="h-5 w-5" aria-hidden="true" />
            Acompanhar o serviço
          </button>
        </div>
      </div>
    </div>
  );
}
