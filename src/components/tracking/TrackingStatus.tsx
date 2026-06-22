import { Car, CheckCircle2, ClipboardList, Flag } from "lucide-react";
import type { OrderStatus, TrackingOrder } from "../../types/order";
import { formatDateTime } from "../../utils/date";

type TrackingStatusProps = {
  order: TrackingOrder;
};

const statusSteps = [
  {
    id: "pending",
    title: "Pendente",
    description: "Seu pedido foi recebido",
    icon: ClipboardList,
  },
  {
    id: "in_progress",
    title: "Em andamento",
    description: "Seu veículo está sendo preparado",
    icon: Car,
  },
  {
    id: "finished",
    title: "Finalizado",
    description: "Serviço concluído e veículo pronto",
    icon: Flag,
  },
] satisfies Array<{
  id: OrderStatus;
  title: string;
  description: string;
  icon: typeof CheckCircle2;
}>;

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  in_progress: 1,
  finished: 2,
};

export default function TrackingStatus({ order }: TrackingStatusProps) {
  const currentIndex = statusIndex[order.status];
  const progressWidth = currentIndex === 0 ? "0%" : currentIndex === 1 ? "33.34%" : "66.68%";
  const createdAt = formatDateTime(order.createdAt);

  return (
    <section data-animate="tracking-status" className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="text-xl font-black text-ink">Status do serviço</h2>

      <div className="mt-8 hidden md:block">
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-[16.66%] right-[16.66%] top-8 h-1 rounded-full bg-slate-200" />
          <div
            className="absolute left-[16.66%] top-8 h-1 rounded-full bg-gradient-to-r from-ocean to-aqua transition-all duration-500"
            style={{ width: progressWidth }}
          />

          <div className="relative grid grid-cols-3 gap-6">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentIndex;

              return (
                <div key={step.id} className="text-center">
                  <span
                    className={[
                      "relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4",
                      isActive ? "border-ocean bg-ocean text-white" : "border-slate-300 bg-white text-slate-400",
                    ].join(" ")}
                  >
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h3 className={["mt-4 text-lg font-black", isActive ? "text-ocean" : "text-ink"].join(" ")}>
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                  {index === 0 && createdAt ? (
                    <span className="mt-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-ocean">
                      {createdAt}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4 md:hidden">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;

          return (
            <div key={step.id} className="flex gap-4">
              <span
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
                  isActive ? "border-ocean bg-ocean text-white" : "border-slate-300 bg-white text-slate-400",
                ].join(" ")}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className={["font-black", isActive ? "text-ocean" : "text-ink"].join(" ")}>
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                {index === 0 && createdAt ? (
                  <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-ocean">
                    {createdAt}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
