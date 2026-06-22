import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Droplets, MessageCircle } from "lucide-react";
import { prefersReducedMotion } from "../utils/animation";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre nós", href: "#sobre-nos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isPillRef = useRef(false);

  useEffect(() => {
    const shell = shellRef.current;
    const content = contentRef.current;

    if (!shell || !content) {
      return;
    }

    const applyHeaderState = (shouldBePill: boolean) => {
      if (isPillRef.current === shouldBePill) {
        return;
      }

      isPillRef.current = shouldBePill;

      const shellStyles = shouldBePill
        ? {
            width: "calc(100% - 24px)",
            maxWidth: "1180px",
            marginTop: "12px",
            borderRadius: "999px",
            boxShadow: "0 18px 45px rgba(8, 47, 73, 0.14)",
            outline: "1px solid rgba(186, 230, 253, 0.9)",
          }
        : {
            width: "100%",
            maxWidth: "100%",
            marginTop: "0px",
            borderRadius: "0px",
            boxShadow: "0 0 0 rgba(8, 47, 73, 0)",
            outline: "0px solid rgba(186, 230, 253, 0)",
          };

      const contentStyles = shouldBePill ? { height: 68 } : { height: 80 };

      if (prefersReducedMotion()) {
        gsap.set(shell, shellStyles);
        gsap.set(content, contentStyles);
        return;
      }

      gsap.to(shell, {
        ...shellStyles,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(content, {
        ...contentStyles,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const handleScroll = () => {
      applyHeaderState(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gsap.killTweensOf([shell, content]);
    };
  }, []);

  return (
    <header data-animate="header" className="fixed inset-x-0 top-0 z-50">
      <div
        ref={shellRef}
        className="mx-auto w-full overflow-hidden border-b border-sky-100/70 bg-white/90 backdrop-blur-xl"
      >
        <div
          ref={contentRef}
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <a
            href="#inicio"
            className="flex items-center gap-3"
            aria-label="Lava+ início"
          >
            <span className="leading-none">
              <strong className="block text-2xl font-black tracking-wide text-ocean">
                LAVA+
              </strong>
              <span className="block text-xs font-extrabold uppercase tracking-[0.24em] text-ink">
                Lava Jato
              </span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-10 text-sm font-semibold text-ink md:flex"
            aria-label="Menu principal"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-ocean"
              >
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
      </div>
    </header>
  );
}
