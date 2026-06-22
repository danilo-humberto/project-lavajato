import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { AlertCircle, Loader2, SearchX } from "lucide-react";
import TrackingCodeCard from "../components/tracking/TrackingCodeCard";
import TrackingDetails from "../components/tracking/TrackingDetails";
import TrackingHelp from "../components/tracking/TrackingHelp";
import TrackingStatus from "../components/tracking/TrackingStatus";
import { observeTrackingOrder } from "../services/trackingService";
import type { TrackingOrder } from "../types/order";
import { prefersReducedMotion } from "../utils/animation";

type TrackingPageState = "loading" | "found" | "not_found" | "error";

export default function Tracking() {
  const { codigo } = useParams<{ codigo: string }>();
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageState, setPageState] = useState<TrackingPageState>("loading");
  const [order, setOrder] = useState<TrackingOrder | null>(null);

  useEffect(() => {
    if (!codigo) {
      setPageState("not_found");
      setOrder(null);
      return;
    }

    setPageState("loading");

    const unsubscribe = observeTrackingOrder(
      codigo,
      (result) => {
        if (result.status === "not_found") {
          setOrder(null);
          setPageState("not_found");
          return;
        }

        setOrder(result.order);
        setPageState("found");
      },
      (error) => {
        console.error("Erro ao carregar acompanhamento:", error);
        setOrder(null);
        setPageState("error");
      },
    );

    return unsubscribe;
  }, [codigo]);

  useEffect(() => {
    const page = pageRef.current;

    if (!page || pageState !== "found" || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='tracking-code-card'], [data-animate='tracking-status'], [data-animate='tracking-details']",
        { y: 22, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "opacity,visibility,transform",
        },
      );
    }, page);

    return () => context.revert();
  }, [pageState]);

  if (pageState === "loading") {
    return (
      <TrackingShell>
        <StateCard
          icon={<Loader2 className="h-9 w-9 animate-spin" aria-hidden="true" />}
          title="Carregando acompanhamento..."
          description="Estamos buscando os dados do seu serviço em tempo real."
        />
      </TrackingShell>
    );
  }

  if (pageState === "error") {
    return (
      <TrackingShell>
        <StateCard
          icon={<AlertCircle className="h-9 w-9" aria-hidden="true" />}
          title="Não foi possível carregar o acompanhamento. Tente novamente."
          description="Verifique sua conexão e tente recarregar a página."
        />
      </TrackingShell>
    );
  }

  if (pageState === "not_found" || !order) {
    return (
      <TrackingShell>
        <StateCard
          icon={<SearchX className="h-9 w-9" aria-hidden="true" />}
          title="Código de acompanhamento não encontrado."
          description="Confira o código informado e tente novamente."
        />
      </TrackingShell>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#f8fdff] px-4 py-8 text-ink sm:px-6 lg:px-8">
      <main className="mx-auto max-w-6xl space-y-6">
        <TrackingCodeCard order={order} />
        <TrackingStatus order={order} />
        <TrackingDetails order={order} />
        <TrackingHelp />
      </main>
    </div>
  );
}

function TrackingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fdff] px-4 py-10">
      {children}
    </div>
  );
}

type StateCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function StateCard({ icon, title, description }: StateCardProps) {
  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-soft">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-ocean">{icon}</div>
      <h1 className="mt-6 text-2xl font-black leading-tight text-ink">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-aqua to-ocean px-6 text-sm font-black text-white shadow-card"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
