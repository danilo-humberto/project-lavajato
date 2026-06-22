import { ShieldCheck, TicketCheck } from "lucide-react";
import type { TrackingOrder } from "../../types/order";
import { formatDateTime } from "../../utils/date";

type TrackingCodeCardProps = {
  order: TrackingOrder;
};

export default function TrackingCodeCard({ order }: TrackingCodeCardProps) {
  const createdAt = formatDateTime(order.createdAt);

  return (
    <section
      data-animate="tracking-code-card"
      className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
            <TicketCheck className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-500">Código de acompanhamento</p>
            <h1 className="mt-1 break-all text-3xl font-black tracking-wide text-ocean sm:text-4xl">
              {order.trackingCode}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Data da solicitação: {createdAt ?? "Aguardando confirmação"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-cyan-50 p-4 text-sm text-slate-700">
          <ShieldCheck className="h-6 w-6 shrink-0 text-ocean" aria-hidden="true" />
          <div>
            <p className="font-black text-ink">Acompanhamento seguro</p>
            <p>Seus dados privados não são exibidos aqui.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
