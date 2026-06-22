import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  CalendarCheck,
  Clock3,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { auth } from "../services/firebase";
import { prefersReducedMotion } from "../utils/animation";

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const benefits = [
  {
    title: "Gestão completa",
    description: "Gerencie todos os pedidos em um só lugar",
    icon: CalendarCheck,
  },
  {
    title: "Atualizações em tempo real",
    description: "Acompanhe o status dos serviços instantaneamente",
    icon: Clock3,
  },
  {
    title: "Acesso seguro",
    description: "Seus dados e informações sempre protegidos",
    icon: ShieldCheck,
  },
];

export default function AdminLogin() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  useEffect(() => {
    const page = pageRef.current;

    if (!page || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='admin-visual'], [data-animate='admin-form']",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.68,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "opacity,visibility,transform",
        },
      );
    }, page);

    return () => context.revert();
  }, []);

  function validateForm() {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    }

    if (!password) {
      nextErrors.password = "Informe sua senha.";
    }

    return nextErrors;
  }

  function getLoginErrorMessage(error: unknown) {
    if (error instanceof FirebaseError) {
      const invalidCredentialCodes = [
        "auth/invalid-credential",
        "auth/wrong-password",
        "auth/user-not-found",
        "auth/invalid-email",
      ];

      if (invalidCredentialCodes.includes(error.code)) {
        return "E-mail ou senha inválidos.";
      }
    }

    return "Não foi possível realizar o login. Tente novamente.";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      await signInWithEmailAndPassword(auth, email.trim(), password);
      window.location.href = "/admin";
    } catch (error) {
      setErrors({ general: getLoginErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main ref={pageRef} className="min-h-screen bg-[#020b1d]">
      <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
        <section
          data-animate="admin-visual"
          className="relative hidden min-h-screen overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14"
        >
          <img
            src="/side-car.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-slate-950/60 to-slate-950/15" />

          <div className="relative">
            <a
              href="/"
              className="inline-flex flex-col leading-none"
              aria-label="Voltar para Lava+"
            >
              <strong className="block text-4xl font-black tracking-wide text-cyan-300">
                LAVA+
              </strong>
              <span className="mt-1 block text-sm font-extrabold uppercase tracking-[0.24em] text-white">
                Lava Jato
              </span>
            </a>
          </div>

          <div className="relative max-w-md">
            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
              Bem-vindo(a) à área administrativa{" "}
              <span className="block text-cyan-300">Lavajato Brilho</span>
            </h1>
            <div className="mt-8 h-1 w-20 rounded-full bg-ocean" />
            <p className="mt-8 text-lg leading-8 text-slate-100">
              Faça login para gerenciar os serviços, acompanhar pedidos e
              atualizar o andamento em tempo real.
            </p>
          </div>

          <div className="relative space-y-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-950/80 text-cyan-300">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-black text-white">{benefit.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-200">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          data-animate="admin-form"
          className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <a
                href="/"
                className="inline-flex flex-col leading-none"
                aria-label="Voltar para Lava+"
              >
                <strong className="block text-4xl font-black tracking-wide text-ocean">
                  LAVA+
                </strong>
                <span className="mt-1 block text-sm font-extrabold uppercase tracking-[0.24em] text-ink">
                  Lava Jato
                </span>
              </a>
            </div>

            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
                <ShieldCheck className="h-9 w-9" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-2xl font-black text-ink">
                Acesso administrativo
              </h2>
              <p className="mt-2 text-slate-600">
                Entre com suas credenciais para continuar
              </p>
            </div>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              {errors.general ? (
                <div
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700"
                  role="alert"
                >
                  {errors.general}
                </div>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-black text-ink">
                  E-mail
                </span>
                <span
                  className={[
                    "flex min-h-14 items-center gap-3 rounded-2xl border bg-white px-4 shadow-sm focus-within:bg-white",
                    errors.email
                      ? "border-red-300 focus-within:border-red-400"
                      : "border-slate-200 focus-within:border-cyan-300",
                  ].join(" ")}
                >
                  <Mail className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                        general: undefined,
                      }));
                    }}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                  />
                </span>
                {errors.email ? (
                  <span className="mt-2 block text-sm font-semibold text-red-600">
                    {errors.email}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-ink">
                  Senha
                </span>
                <span
                  className={[
                    "flex min-h-14 items-center gap-3 rounded-2xl border bg-white px-4 shadow-sm focus-within:bg-white",
                    errors.password
                      ? "border-red-300 focus-within:border-red-400"
                      : "border-slate-200 focus-within:border-cyan-300",
                  ].join(" ")}
                >
                  <Lock className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        password: undefined,
                        general: undefined,
                      }));
                    }}
                    placeholder="********"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="rounded-full p-1 text-slate-500 transition-colors hover:text-ocean focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </span>
                {errors.password ? (
                  <span className="mt-2 block text-sm font-semibold text-red-600">
                    {errors.password}
                  </span>
                ) : null}
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-aqua to-ocean px-6 text-base font-black text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-card"
              >
                <LogIn className="h-5 w-5" aria-hidden="true" />
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
