import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import type { Order, OrderStatus } from "../types/order";

export function listenOrders(onChange: (orders: Order[]) => void, onError: (error: Error) => void) {
  const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((document) => document.data() as Order);
      onChange(orders);
    },
    onError,
  );
}

export async function updateOrderStatus(trackingCode: string, status: OrderStatus) {
  const batch = writeBatch(db);
  const orderRef = doc(db, "orders", trackingCode);
  const trackingRef = doc(db, "tracking", trackingCode);
  const timestamp = serverTimestamp();

  const orderUpdates: Partial<Order> = {
    status,
    updatedAt: timestamp,
  };

  if (status === "in_progress") {
    orderUpdates.startedAt = timestamp;
  }

  if (status === "finished") {
    orderUpdates.finishedAt = timestamp;
  }

  batch.update(orderRef, orderUpdates);
  batch.update(trackingRef, {
    status,
    updatedAt: timestamp,
  });

  await batch.commit();
}
