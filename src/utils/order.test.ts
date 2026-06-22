import { describe, expect, it } from "vitest";
import {
  getExtrasTotal,
  getOrderTotal,
  getSelectedExtras,
  getWashPrice,
  formatPhoneInput,
  hasFormErrors,
  sanitizePhone,
  validateCustomerForm,
} from "./order";

describe("order helpers", () => {
  it("returns the wash price for each car size and wash type", () => {
    expect(getWashPrice("large", "complete")).toBe(80);
    expect(getWashPrice("large", "simple")).toBe(60);
    expect(getWashPrice("medium", "complete")).toBe(70);
    expect(getWashPrice("medium", "simple")).toBe(50);
    expect(getWashPrice("small", "complete")).toBe(60);
    expect(getWashPrice("small", "simple")).toBe(40);
  });

  it("calculates the total with selected extras", () => {
    const selectedExtras = getSelectedExtras(["seat-wash", "roof-wash"]);
    const extrasTotal = getExtrasTotal(selectedExtras);

    expect(extrasTotal).toBe(300);
    expect(getOrderTotal(80, extrasTotal)).toBe(380);
  });

  it("sanitizes phone numbers before validation", () => {
    expect(sanitizePhone("(81) 99999-9999")).toBe("81999999999");
  });

  it("formats phone input and removes non-numeric characters", () => {
    expect(formatPhoneInput("81abc99999-9999")).toBe("(81) 99999-9999");
    expect(formatPhoneInput("819999999999999")).toBe("(81) 99999-9999");
    expect(formatPhoneInput("8133334444")).toBe("(81) 3333-4444");
  });

  it("validates required customer fields", () => {
    const errors = validateCustomerForm({
      customerName: "",
      customerPhone: "123",
      paymentMethod: "",
    });

    expect(errors).toEqual({
      customerName: "Informe seu nome.",
      customerPhone: "Informe um número de WhatsApp válido.",
      paymentMethod: "Selecione a forma de pagamento.",
    });
    expect(hasFormErrors(errors)).toBe(true);
  });

  it("accepts valid customer data", () => {
    const errors = validateCustomerForm({
      customerName: "Maria Silva",
      customerPhone: "(81) 99999-9999",
      paymentMethod: "pix",
    });

    expect(errors).toEqual({});
    expect(hasFormErrors(errors)).toBe(false);
  });
});
