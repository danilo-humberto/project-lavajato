import { Headphones, MessageCircle } from "lucide-react";

export default function TrackingHelp() {
  return (
    <section className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-ocean">
            <Headphones className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-black text-ink">Precisa de ajuda?</h2>
            <p className="mt-1 text-sm text-slate-600">Entre em contato conosco pelo WhatsApp.</p>
          </div>
        </div>

        <a
          href="https://wa.me/5581999999999"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-aqua to-ocean px-6 text-base font-black text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-cyan-200"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}
