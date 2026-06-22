export type CarSize = "large" | "medium" | "small" | "motorcycle";
export type WashType = "complete" | "simple";
export type PaymentMethod = "pix" | "cash";

export type CarSizeOption = {
  id: CarSize;
  label: string;
  example: string;
};

export type WashTypeOption = {
  id: WashType;
  label: string;
  description: string;
};

export type ExtraService = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CustomerFormValues = {
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod | "";
};

export type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>>;
