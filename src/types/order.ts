export type OrderStatus = "pending" | "in_progress" | "finished";

export type PaymentMethod = "pix" | "cash";

export type CarSize = "large" | "medium" | "small" | "motorcycle";

export type WashType = "complete" | "simple";

export type SelectedExtra = {
  id: string;
  title: string;
  price: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;

  carSize: CarSize;
  carSizeLabel: string;

  washType: WashType;
  washTypeLabel: string;

  selectedExtras: SelectedExtra[];

  washPrice: number;
  extrasTotal: number;
  total: number;
};

export type Order = CreateOrderInput & {
  trackingCode: string;
  status: OrderStatus;
  createdAt: unknown;
  updatedAt: unknown;
  startedAt: unknown | null;
  finishedAt: unknown | null;
};

export type TrackingOrder = {
  trackingCode: string;
  status: OrderStatus;

  carSizeLabel: string;
  washTypeLabel: string;

  selectedExtras: {
    title: string;
  }[];

  total: number;

  createdAt: unknown;
  updatedAt: unknown;
};
