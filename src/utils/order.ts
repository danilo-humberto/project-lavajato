import { extraServices, washPrices } from "../data/services";
import type { CarSize, CustomerFormErrors, CustomerFormValues, ExtraService, WashType } from "../types/service";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function getWashPrice(carSize: CarSize, washType: WashType) {
  return washPrices[carSize][washType];
}

export function getSelectedExtras(selectedExtraIds: string[], services: ExtraService[] = extraServices) {
  return services.filter((service) => selectedExtraIds.includes(service.id));
}

export function getExtrasTotal(selectedExtras: ExtraService[]) {
  return selectedExtras.reduce((total, service) => total + service.price, 0);
}

export function getOrderTotal(washPrice: number, extrasTotal: number) {
  return washPrice + extrasTotal;
}

export function sanitizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function formatPhoneInput(phone: string) {
  const digits = sanitizePhone(phone).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  const areaCode = digits.slice(0, 2);
  const isMobilePhone = digits.length > 10;
  const firstPartEnd = isMobilePhone ? 7 : 6;
  const firstPart = digits.slice(2, firstPartEnd);
  const secondPart = digits.slice(firstPartEnd);

  if (!firstPart) {
    return `(${areaCode}`;
  }

  if (!secondPart) {
    return `(${areaCode}) ${firstPart}`;
  }

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

export function validateCustomerForm(values: CustomerFormValues) {
  const errors: CustomerFormErrors = {};

  if (!values.customerName.trim()) {
    errors.customerName = "Informe seu nome.";
  }

  if (sanitizePhone(values.customerPhone).length < 10) {
    errors.customerPhone = "Informe um número de WhatsApp válido.";
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = "Selecione a forma de pagamento.";
  }

  return errors;
}

export function hasFormErrors(errors: CustomerFormErrors) {
  return Object.keys(errors).length > 0;
}
