import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import type { CreateOrderInput } from "../types/order";
import { generateTrackingCode } from "../utils/generateTrackingCode";

export async function createOrder(orderData: CreateOrderInput): Promise<string> {
  const trackingCode = generateTrackingCode();
  const orderRef = doc(db, "orders", trackingCode);
  const trackingRef = doc(db, "tracking", trackingCode);
  const batch = writeBatch(db);

  const timestamp = serverTimestamp();

  batch.set(orderRef, {
    trackingCode,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    paymentMethod: orderData.paymentMethod,
    carSize: orderData.carSize,
    carSizeLabel: orderData.carSizeLabel,
    washType: orderData.washType,
    washTypeLabel: orderData.washTypeLabel,
    selectedExtras: orderData.selectedExtras,
    washPrice: orderData.washPrice,
    extrasTotal: orderData.extrasTotal,
    total: orderData.total,
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
    startedAt: null,
    finishedAt: null,
  });

  batch.set(trackingRef, {
    trackingCode,
    status: "pending",
    carSizeLabel: orderData.carSizeLabel,
    washTypeLabel: orderData.washTypeLabel,
    selectedExtras: orderData.selectedExtras.map((extra) => ({
      title: extra.title,
    })),
    total: orderData.total,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await batch.commit();

  return trackingCode;
}
