import {
  AtSign,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contato"
      className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-50 to-white px-4 pt-16 sm:px-6 lg:px-8"
    >
      <div
        className="absolute left-0 top-0 h-16 w-full rounded-b-[60%] bg-white"
        aria-hidden="true"
      />
      <span
        className="absolute left-1/3 top-12 h-10 w-10 rounded-full border border-cyan-200 bg-white/30"
        aria-hidden="true"
      />
      <span
        className="absolute right-1/3 top-24 h-6 w-6 rounded-full border border-cyan-200 bg-white/30"
        aria-hidden="true"
      />
      <span
        className="absolute right-24 bottom-24 h-14 w-14 rounded-full border border-cyan-200 bg-white/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <a
            href="#inicio"
            className="inline-flex items-center gap-3"
            aria-label="Lava+ início"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-ocean text-white shadow-card">
              <Droplets className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="leading-none">
              <strong className="block text-3xl font-black tracking-wide text-ocean">
                LAVA+
              </strong>
              <span className="block text-xs font-extrabold uppercase tracking-[0.24em] text-ink">
                Lava Jato
              </span>
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-700">
            Seu carro merece o melhor cuidado. Qualidade, brilho e proteção.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="#contato"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ocean shadow-card"
              aria-label="Instagram"
            >
              <AtSign className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="#contato"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-500 shadow-card"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-base font-black text-ink">Contato</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-ocean"
                aria-hidden="true"
              />
              <span>WhatsApp: (81) 99999-9999</span>
            </li>
            <li className="flex gap-3">
              <AtSign
                className="mt-0.5 h-5 w-5 shrink-0 text-pink-500"
                aria-hidden="true"
              />
              <span>@lava_mais</span>
            </li>
            <li className="flex gap-3">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0 text-ocean"
                aria-hidden="true"
              />
              <span>Rua das Flores, 123 - Centro</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-black text-ink">
            Horário de atendimento
          </h2>
          <ul className="mt-5 space-y-4 text-sm text-slate-700">
            <li className="flex gap-3">
              <Clock
                className="mt-0.5 h-5 w-5 shrink-0 text-ocean"
                aria-hidden="true"
              />
              <span>
                Segunda a Sábado
                <br />
                08:00 às 18:00
              </span>
            </li>
            <li className="pl-8">
              Domingo
              <br />
              08:00 às 13:00
            </li>
          </ul>
        </div>
      </div>

      <div className="relative -mx-4 bg-gradient-to-r from-ocean to-aqua px-4 py-4 text-center text-sm font-semibold text-white sm:-mx-6 lg:-mx-8">
        © {new Date().getFullYear()} Lava+. Todos os direitos reservados.
      </div>
    </footer>
  );
}
