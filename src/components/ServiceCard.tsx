import { Car, Check } from "lucide-react";
import type { WashType } from "../types/service";
import { animateSelectionPress } from "../utils/animation";
import { formatCurrency } from "../utils/order";

type ServiceCardProps = {
  id: WashType;
  title: string;
  vehicleLabel: string;
  description: string;
  price: number;
  selected: boolean;
  onSelect: (id: WashType) => void;
};

export default function ServiceCard({
  id,
  title,
  vehicleLabel,
  description,
  price,
  selected,
  onSelect,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      data-animate="wash-card"
      onClick={(event) => {
        animateSelectionPress(event.currentTarget);
        onSelect(id);
      }}
      aria-pressed={selected}
      className={[
        "relative flex min-h-40 w-full gap-4 rounded-2xl border bg-white p-5 text-left shadow-card transition-colors duration-200",
        "focus:outline-none focus:ring-4 focus:ring-cyan-200",
        selected
          ? "border-cyan-400 bg-cyan-50/60 ring-1 ring-cyan-300"
          : "border-sky-100 hover:border-cyan-200",
      ].join(" ")}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
        <Car className="h-8 w-8" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1 pr-8">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-base font-extrabold text-ink">{title}</span>
          <span className="text-xs font-bold text-slate-500">{vehicleLabel}</span>
        </span>
        <span className="mt-2 block text-sm leading-6 text-slate-600">{description}</span>
        <span className="mt-3 block text-base font-black text-ocean">{formatCurrency(price)}</span>
      </span>

      <span
        className={[
          "absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border",
          selected ? "border-aqua bg-aqua text-white" : "border-slate-300 bg-white",
        ].join(" ")}
        aria-hidden="true"
      >
        {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
      </span>
    </button>
  );
}
