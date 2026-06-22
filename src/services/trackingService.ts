import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { TrackingOrder } from "../types/order";

type TrackingSnapshotResult =
  | {
      status: "found";
      order: TrackingOrder;
    }
  | {
      status: "not_found";
      order: null;
    };

export function observeTrackingOrder(
  trackingCode: string,
  onChange: (result: TrackingSnapshotResult) => void,
  onError: (error: Error) => void,
) {
  const trackingRef = doc(db, "tracking", trackingCode);

  return onSnapshot(
    trackingRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange({ status: "not_found", order: null });
        return;
      }

      onChange({
        status: "found",
        order: snapshot.data() as TrackingOrder,
      });
    },
    onError,
  );
}
