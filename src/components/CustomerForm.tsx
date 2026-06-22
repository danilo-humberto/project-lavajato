import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Banknote, Landmark, Phone, User } from "lucide-react";
import type { CustomerFormErrors, CustomerFormValues, PaymentMethod } from "../types/service";
import { animateSelectionPress, prefersReducedMotion } from "../utils/animation";
import { formatPhoneInput } from "../utils/order";

type CustomerFormProps = {
  values: CustomerFormValues;
  errors: CustomerFormErrors;
  successMessage: string | null;
  onChange: <Field extends keyof CustomerFormValues>(field: Field, value: CustomerFormValues[Field]) => void;
};

const paymentOptions: Array<{ id: PaymentMethod; label: string; icon: typeof Landmark }> = [
  {
    id: "pix",
    label: "Pix",
    icon: Landmark,
  },
  {
    id: "cash",
    label: "Dinheiro em espécie",
    icon: Banknote,
  },
];

export default function CustomerForm({ values, errors, successMessage, onChange }: CustomerFormProps) {
  const formRef = useRef<HTMLElement>(null);
  const nameInputClasses = [
    "flex min-h-12 items-center gap-3 rounded-2xl border bg-sky-50/60 px-4 text-slate-500 focus-within:bg-white",
    errors.customerName ? "border-red-300 focus-within:border-red-400" : "border-sky-100 focus-within:border-cyan-300",
  ].join(" ");

  const phoneInputClasses = [
    "flex min-h-12 items-center gap-3 rounded-2xl border bg-sky-50/60 px-4 text-slate-500 focus-within:bg-white",
    errors.customerPhone ? "border-red-300 focus-within:border-red-400" : "border-sky-100 focus-within:border-cyan-300",
  ].join(" ");

  useEffect(() => {
    const form = formRef.current;

    if (!form || prefersReducedMotion()) {
      return;
    }

    const messages = form.querySelectorAll<HTMLElement>("[data-animate='form-message']");

    if (messages.length === 0) {
      return;
    }

    gsap.fromTo(
      messages,
      { y: 8, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.28,
        ease: "power2.out",
        stagger: 0.04,
        overwrite: true,
      },
    );

    return () => {
      gsap.killTweensOf(messages);
    };
  }, [errors, successMessage]);

  return (
    <section
      ref={formRef}
      className="rounded-3xl border border-sky-100 bg-white p-5 shadow-card sm:p-6"
      aria-labelledby="customer-form-title"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-ocean">
          <User className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-ocean">Dados do cliente</p>
          <h2 id="customer-form-title" className="text-xl font-black text-ink">
            Informe os dados para contato
          </h2>
        </div>
      </div>

      {successMessage ? (
        <div
          data-animate="form-message"
          className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-700"
          role="status"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink">Nome do cliente</span>
          <span className={nameInputClasses}>
            <User className="h-5 w-5 text-ocean" aria-hidden="true" />
            <input
              type="text"
              value={values.customerName}
              onChange={(event) => onChange("customerName", event.target.value)}
              placeholder="Ex: Maria Silva"
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? "customer-name-error" : undefined}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
            />
          </span>
          {errors.customerName ? (
            <span id="customer-name-error" data-animate="form-message" className="mt-2 block text-sm font-semibold text-red-600">
              {errors.customerName}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink">Número de WhatsApp</span>
          <span className={phoneInputClasses}>
            <Phone className="h-5 w-5 text-ocean" aria-hidden="true" />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              value={values.customerPhone}
              onChange={(event) => onChange("customerPhone", formatPhoneInput(event.target.value))}
              placeholder="(81) 99999-9999"
              aria-invalid={Boolean(errors.customerPhone)}
              aria-describedby={errors.customerPhone ? "customer-phone-error" : undefined}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
            />
          </span>
          {errors.customerPhone ? (
            <span id="customer-phone-error" data-animate="form-message" className="mt-2 block text-sm font-semibold text-red-600">
              {errors.customerPhone}
            </span>
          ) : null}
        </label>
      </div>

      <fieldset className="mt-5" aria-describedby={errors.paymentMethod ? "payment-method-error" : undefined}>
        <legend className="mb-3 text-sm font-bold text-ink">Forma de pagamento</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {paymentOptions.map((option) => {
            const Icon = option.icon;

            return (
              <label
                key={option.id}
                className="cursor-pointer"
                onClick={(event) => animateSelectionPress(event.currentTarget)}
              >
                <input
                  className="peer sr-only"
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={values.paymentMethod === option.id}
                  onChange={() => onChange("paymentMethod", option.id)}
                />
                <span
                  className={[
                    "flex min-h-14 items-center gap-3 rounded-2xl border bg-white px-4 text-sm font-extrabold text-ink shadow-sm transition-colors duration-200",
                    "peer-focus-visible:ring-4 peer-focus-visible:ring-cyan-200 peer-checked:border-cyan-400 peer-checked:bg-cyan-50 peer-checked:text-ocean",
                    errors.paymentMethod ? "border-red-300" : "border-sky-100",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.paymentMethod ? (
          <span id="payment-method-error" data-animate="form-message" className="mt-2 block text-sm font-semibold text-red-600">
            {errors.paymentMethod}
          </span>
        ) : null}
      </fieldset>
    </section>
  );
}
