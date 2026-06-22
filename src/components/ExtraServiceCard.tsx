import { Check, Sparkles } from "lucide-react";
import type { ExtraService } from "../types/service";
import { animateSelectionPress } from "../utils/animation";
import { formatCurrency } from "../utils/order";

type ExtraServiceCardProps = {
  service: ExtraService;
  selected: boolean;
  onToggle: (id: string) => void;
};

export default function ExtraServiceCard({ service, selected, onToggle }: ExtraServiceCardProps) {
  return (
    <button
      type="button"
      data-animate="extra-card"
      onClick={(event) => {
        animateSelectionPress(event.currentTarget);
        onToggle(service.id);
      }}
      aria-pressed={selected}
      className={[
        "relative min-h-44 w-full rounded-2xl border bg-white p-5 text-left shadow-card transition-colors duration-200",
        "focus:outline-none focus:ring-4 focus:ring-cyan-200",
        selected ? "border-cyan-400 bg-cyan-50/60" : "border-sky-100 hover:border-cyan-200",
      ].join(" ")}
    >
      <span
        className={[
          "absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-md border",
          selected ? "border-aqua bg-aqua text-white" : "border-slate-300 bg-white",
        ].join(" ")}
        aria-hidden="true"
      >
        {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
      </span>

      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
        <Sparkles className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="mt-4 block pr-8 text-sm font-extrabold text-ink">{service.title}</span>
      <span className="mt-2 block text-sm leading-6 text-slate-600">{service.description}</span>
      <span className="mt-4 block text-base font-black text-ocean">{formatCurrency(service.price)}</span>
    </button>
  );
}
