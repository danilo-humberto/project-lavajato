import { Car, CheckCircle2, Droplet, Info } from "lucide-react";
import type { TrackingOrder } from "../../types/order";
import { formatCurrency } from "../../utils/order";

type TrackingDetailsProps = {
  order: TrackingOrder;
};

export default function TrackingDetails({ order }: TrackingDetailsProps) {
  return (
    <section
      data-animate="tracking-details"
      className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-soft sm:p-8"
    >
      <h2 className="text-xl font-black text-ink">Detalhes do serviço</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr_0.9fr] lg:divide-x lg:divide-sky-100">
        <div className="space-y-6 lg:pr-8">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-ink">
              <Car className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-slate-600">Tamanho do veículo</p>
              <p className="mt-1 text-xl font-black text-ink">
                {order.carSizeLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-ink">
              <Droplet className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-slate-600">Tipo de lavagem</p>
              <p className="mt-1 text-xl font-black text-ink">
                {order.washTypeLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:px-8">
          <h3 className="font-black text-ink">Extras selecionados</h3>
          {order.selectedExtras.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {order.selectedExtras.map((extra) => (
                <li
                  key={extra.title}
                  className="flex items-center gap-3 text-sm text-ink"
                >
                  <CheckCircle2
                    className="h-5 w-5 shrink-0 text-ocean"
                    aria-hidden="true"
                  />
                  {extra.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Nenhum extra selecionado
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-sky-50 p-6 lg:ml-8">
          <p className="font-black text-ink">Total do serviço</p>
          <p className="mt-3 text-4xl font-black text-ocean">
            {formatCurrency(order.total)}
          </p>
        </div>
      </div>
    </section>
  );
}
