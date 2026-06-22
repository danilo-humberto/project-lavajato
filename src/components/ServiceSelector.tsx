import { useMemo, useState } from "react";
import { Car, Check, Truck } from "lucide-react";
import CustomerForm from "./CustomerForm";
import ExtraServiceCard from "./ExtraServiceCard";
import OrderSummary from "./OrderSummary";
import ServiceCard from "./ServiceCard";
import { carSizes, extraServices, washTypes } from "../data/services";
import type { CarSize, CustomerFormErrors, CustomerFormValues, OrderPayload, WashType } from "../types/service";
import {
  getExtrasTotal,
  getOrderTotal,
  getSelectedExtras,
  getWashPrice,
  hasFormErrors,
  sanitizePhone,
  validateCustomerForm,
} from "../utils/order";

const vehicleIcons = {
  large: Truck,
  medium: Car,
  small: Car,
} satisfies Record<CarSize, typeof Car>;

type StepHeaderProps = {
  number: string;
  title: string;
};

function StepHeader({ number, title }: StepHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-sm font-black text-white">
        {number}
      </span>
      <h3 className="text-lg font-black text-ink">{title}</h3>
    </div>
  );
}

export default function ServiceSelector() {
  const [selectedCarSize, setSelectedCarSize] = useState<CarSize>("large");
  const [selectedWashType, setSelectedWashType] = useState<WashType>("complete");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<CustomerFormValues>({
    customerName: "",
    customerPhone: "",
    paymentMethod: "",
  });
  const [formErrors, setFormErrors] = useState<CustomerFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedCarSizeData = carSizes.find((carSize) => carSize.id === selectedCarSize) ?? carSizes[0];
  const selectedWashTypeData = washTypes.find((washType) => washType.id === selectedWashType) ?? washTypes[0];

  const washPrice = getWashPrice(selectedCarSize, selectedWashType);
  const selectedExtraServices = useMemo(() => getSelectedExtras(selectedExtras), [selectedExtras]);
  const extrasTotal = getExtrasTotal(selectedExtraServices);
  const total = getOrderTotal(washPrice, extrasTotal);

  function handleCarSizeSelect(carSize: CarSize) {
    setSelectedCarSize(carSize);
    setSuccessMessage(null);
  }

  function handleWashTypeSelect(washType: WashType) {
    setSelectedWashType(washType);
    setSuccessMessage(null);
  }

  function handleExtraToggle(extraId: string) {
    setSelectedExtras((currentExtras) =>
      currentExtras.includes(extraId)
        ? currentExtras.filter((selectedExtraId) => selectedExtraId !== extraId)
        : [...currentExtras, extraId],
    );
    setSuccessMessage(null);
  }

  function handleFormChange<Field extends keyof CustomerFormValues>(field: Field, value: CustomerFormValues[Field]) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setFormErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
    setSuccessMessage(null);
  }

  function handleSubmit() {
    const nextErrors = validateCustomerForm(formValues);
    setFormErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      setSuccessMessage(null);
      return;
    }

    if (!formValues.paymentMethod) {
      return;
    }

    const order: OrderPayload = {
      customerName: formValues.customerName.trim(),
      customerPhone: sanitizePhone(formValues.customerPhone),
      paymentMethod: formValues.paymentMethod,
      carSize: selectedCarSize,
      washType: selectedWashType,
      selectedExtras,
      washPrice,
      extrasTotal,
      total,
      createdAt: new Date().toISOString(),
    };

    console.log("Pedido criado:", order);
    setSuccessMessage("Pedido criado com sucesso! Em breve entraremos em contato pelo WhatsApp.");
  }

  return (
    <section id="servicos" className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
            Escolha o <span className="text-ocean">serviço ideal</span> para seu carro
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Selecione as opções abaixo e veja o resumo do seu pedido ao lado.
          </p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-ocean to-aqua" />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-8">
            <section>
              <StepHeader number="1" title="Escolha o tamanho do seu carro" />
              <div className="grid gap-4 sm:grid-cols-3">
                {carSizes.map((vehicle) => {
                  const Icon = vehicleIcons[vehicle.id];
                  const isSelected = selectedCarSize === vehicle.id;

                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => handleCarSizeSelect(vehicle.id)}
                      aria-pressed={isSelected}
                      className={[
                        "relative rounded-2xl border bg-white p-5 text-center shadow-card transition",
                        "focus:outline-none focus:ring-4 focus:ring-cyan-200",
                        isSelected
                          ? "border-cyan-400 bg-cyan-50/60 ring-1 ring-cyan-300"
                          : "border-sky-100 hover:border-cyan-200",
                      ].join(" ")}
                    >
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-ocean">
                        <Icon className="h-9 w-9" aria-hidden="true" />
                      </span>
                      <span className="mt-4 block text-base font-black text-ink">{vehicle.label}</span>
                      <span className="mt-1 block text-sm text-slate-600">Ex: {vehicle.example}</span>
                      {isSelected ? (
                        <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-aqua text-white">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <StepHeader number="2" title="Escolha o tipo de lavagem" />
              <div className="grid gap-4 md:grid-cols-2">
                {washTypes.map((washType) => (
                  <ServiceCard
                    key={washType.id}
                    id={washType.id}
                    title={washType.label}
                    vehicleLabel={selectedCarSizeData.label}
                    description={washType.description}
                    price={getWashPrice(selectedCarSize, washType.id)}
                    selected={selectedWashType === washType.id}
                    onSelect={handleWashTypeSelect}
                  />
                ))}
              </div>
            </section>

            <section>
              <StepHeader number="3" title="Adicione serviços extras (opcional)" />
              <div className="grid gap-4 md:grid-cols-3">
                {extraServices.map((service) => (
                  <ExtraServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedExtras.includes(service.id)}
                    onToggle={handleExtraToggle}
                  />
                ))}
              </div>
            </section>

            <CustomerForm
              values={formValues}
              errors={formErrors}
              successMessage={successMessage}
              onChange={handleFormChange}
            />
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary
              carSizeLabel={selectedCarSizeData.label}
              washTypeLabel={selectedWashTypeData.label}
              washPrice={washPrice}
              selectedExtras={selectedExtraServices}
              total={total}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
