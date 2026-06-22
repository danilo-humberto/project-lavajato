import { Droplets, MessageCircle } from "lucide-react";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre nós", href: "#sobre-nos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  return (
    <header data-animate="header" className="sticky top-0 z-50 border-b border-sky-100/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Lava+ início">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-ocean text-white shadow-card">
            <Droplets className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <strong className="block text-2xl font-black tracking-wide text-ocean">LAVA+</strong>
            <span className="block text-xs font-extrabold uppercase tracking-[0.24em] text-ink">
              Lava Jato
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-10 text-sm font-semibold text-ink md:flex" aria-label="Menu principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-ocean">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="https://wa.me/5581999999999"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aqua to-ocean px-4 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:px-6"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Fale no WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
