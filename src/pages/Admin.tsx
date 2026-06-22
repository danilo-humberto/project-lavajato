import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LogOut,
  MoreVertical,
  RefreshCw,
  Timer,
  X,
} from "lucide-react";
import { auth } from "../services/firebase";
import {
  listenOrders,
  updateOrderStatus,
} from "../services/adminOrdersService";
import type { Order, OrderStatus, PaymentMethod } from "../types/order";
import { prefersReducedMotion } from "../utils/animation";
import { formatDateTime } from "../utils/date";
import { formatCurrency, formatPhoneInput } from "../utils/order";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  finished: "Finalizado",
};

const paymentLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  cash: "Dinheiro",
};

const kanbanColumns: Array<{
  status: OrderStatus;
  title: string;
  accent: string;
  badge: string;
}> = [
  {
    status: "pending",
    title: "Pendentes",
    accent: "border-t-ocean",
    badge: "bg-blue-100 text-ocean",
  },
  {
    status: "in_progress",
    title: "Em andamento",
    accent: "border-t-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    status: "finished",
    title: "Finalizados",
    accent: "border-t-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
];

export default function Admin() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingTrackingCode, setUpdatingTrackingCode] = useState<
    string | null
  >(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [manualRefreshAt, setManualRefreshAt] = useState<Date | null>(null);
  const [adminEmail, setAdminEmail] = useState(auth.currentUser?.email ?? "");

  useEffect(() => {
    const unsubscribe = listenOrders(
      (nextOrders) => {
        setOrders(nextOrders);
        setIsLoading(false);
        setLoadError(null);
      },
      (error) => {
        console.error("Erro ao carregar pedidos:", error);
        setIsLoading(false);
        setLoadError("Não foi possível carregar os pedidos.");
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminEmail(user?.email ?? "");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel || isLoading || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='admin-summary'], [data-animate='admin-column'], [data-animate='admin-bottom-bar']",
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.46,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "opacity,visibility,transform",
        },
      );
    }, panel);

    return () => context.revert();
  }, [isLoading]);

  const ordersByStatus = useMemo(() => {
    return kanbanColumns.reduce<Record<OrderStatus, Order[]>>(
      (accumulator, column) => {
        accumulator[column.status] = orders.filter(
          (order) => order.status === column.status,
        );
        return accumulator;
      },
      {
        pending: [],
        in_progress: [],
        finished: [],
      },
    );
  }, [orders]);

  const latestUpdate = useMemo(() => {
    const dates = orders
      .map(
        (order) =>
          getDateFromValue(order.updatedAt) ??
          getDateFromValue(order.createdAt),
      )
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => b.getTime() - a.getTime());

    return dates[0] ? formatDateTime(dates[0].toISOString()) : null;
  }, [orders]);

  async function handleSignOut() {
    await signOut(auth);
    window.location.href = "/admin/login";
  }

  async function handleStatusUpdate(order: Order, nextStatus: OrderStatus) {
    setUpdatingTrackingCode(order.trackingCode);
    setActionError(null);

    try {
      await updateOrderStatus(order.trackingCode, nextStatus);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setActionError("Não foi possível atualizar o status do pedido.");
    } finally {
      setUpdatingTrackingCode(null);
    }
  }

  function handleRefreshClick() {
    setManualRefreshAt(new Date());
  }

  return (
    <div ref={panelRef} className="min-h-screen bg-[#f8f5fb] text-ink">
      <AdminTopbar adminEmail={adminEmail} onSignOut={handleSignOut} />

      <main className="mx-auto max-w-[1530px] px-4 pb-7 pt-9 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(240px,1fr)_minmax(0,1024px)] lg:items-center">
          <div className="flex items-center gap-5">
            <span
              className="h-14 w-1 rounded-full bg-ocean"
              aria-hidden="true"
            />
            <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
              Pedidos
            </h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Pendentes"
              count={ordersByStatus.pending.length}
              icon={ClipboardList}
              tone="blue"
            />
            <SummaryCard
              title="Em andamento"
              count={ordersByStatus.in_progress.length}
              icon={Timer}
              tone="orange"
            />
            <SummaryCard
              title="Finalizados"
              count={ordersByStatus.finished.length}
              icon={CheckCircle2}
              tone="green"
            />
          </div>
        </section>

        {actionError ? (
          <div
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
            role="alert"
          >
            {actionError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 rounded-[1.4rem] border border-sky-100 bg-white p-10 text-center shadow-soft">
            <p className="text-lg font-black text-ink">Carregando pedidos...</p>
          </div>
        ) : loadError ? (
          <div className="mt-8 rounded-[1.4rem] border border-red-200 bg-white p-10 text-center shadow-soft">
            <p className="text-lg font-black text-red-700">{loadError}</p>
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 xl:grid-cols-3">
              {kanbanColumns.map((column) => (
                <KanbanColumn
                  key={column.status}
                  column={column}
                  orders={ordersByStatus[column.status]}
                  updatingTrackingCode={updatingTrackingCode}
                  onOpenDetails={setSelectedOrder}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </section>

            <BottomStatusBar
              latestUpdate={
                manualRefreshAt
                  ? formatDateTime(manualRefreshAt.toISOString())
                  : latestUpdate
              }
              onRefresh={handleRefreshClick}
            />
          </>
        )}
      </main>

      {selectedOrder ? (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      ) : null}
    </div>
  );
}

function AdminTopbar({
  adminEmail,
  onSignOut,
}: {
  adminEmail: string;
  onSignOut: () => void;
}) {
  return (
    <header className="bg-[#071c3a] text-white shadow-lg shadow-sky-950/10">
      <div className="mx-auto flex min-h-20 max-w-[1530px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/admin"
            className="inline-flex flex-col leading-none"
            aria-label="Painel Lava+"
          >
            <strong className="text-3xl font-black tracking-wide text-cyan-300">
              LAVA+
            </strong>
            <span className="mt-1 text-xs font-extrabold uppercase tracking-[0.24em] text-white">
              Lava Jato
            </span>
          </a>

          <span
            className="hidden h-12 w-px bg-white/20 sm:block"
            aria-hidden="true"
          />

          <div>
            <h2 className="text-xl font-black">Painel administrativo</h2>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              Acesso: {adminEmail || "administrador"}
            </p>
          </div>
        </div>

        <nav
          className="flex flex-wrap items-center gap-3"
          aria-label="Ações administrativas"
        >
          <a
            href="#pedidos"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-black text-white shadow-sm"
          >
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            Pedidos
          </a>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 text-sm font-black text-white transition-colors hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}

type SummaryCardProps = {
  title: string;
  count: number;
  icon: typeof ClipboardList;
  tone: "blue" | "orange" | "green";
};

function SummaryCard({ title, count, icon: Icon, tone }: SummaryCardProps) {
  const toneClasses = {
    blue: {
      icon: "bg-blue-100 text-ocean",
      number: "text-ocean",
    },
    orange: {
      icon: "bg-orange-100 text-orange-700",
      number: "text-orange-700",
    },
    green: {
      icon: "bg-emerald-100 text-emerald-700",
      number: "text-emerald-700",
    },
  };

  return (
    <article
      data-animate="admin-summary"
      className="rounded-2xl bg-white p-5 shadow-card"
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full ${toneClasses[tone].icon}`}
        >
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p
            className={`text-3xl font-black leading-none ${toneClasses[tone].number}`}
          >
            {String(count).padStart(2, "0")}
          </p>
          <h2 className="mt-2 truncate text-sm font-black text-ink">{title}</h2>
        </div>
      </div>
    </article>
  );
}

type KanbanColumnProps = {
  column: (typeof kanbanColumns)[number];
  orders: Order[];
  updatingTrackingCode: string | null;
  onOpenDetails: (order: Order) => void;
  onStatusUpdate: (order: Order, nextStatus: OrderStatus) => void;
};

function KanbanColumn({
  column,
  orders,
  updatingTrackingCode,
  onOpenDetails,
  onStatusUpdate,
}: KanbanColumnProps) {
  return (
    <section
      id="pedidos"
      data-animate="admin-column"
      className={`min-h-[620px] rounded-[1.15rem] border border-slate-200 border-t-4 ${column.accent} bg-white/55 shadow-card`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-black text-ink">{column.title}</h2>
      </header>

      <div className="space-y-4 p-4">
        {orders.length === 0 ? (
          <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-5 text-sm font-bold text-slate-500">
            Nenhum pedido
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.trackingCode}
              order={order}
              isUpdating={updatingTrackingCode === order.trackingCode}
              onOpenDetails={onOpenDetails}
              onStatusUpdate={onStatusUpdate}
            />
          ))
        )}
      </div>
    </section>
  );
}

type OrderCardProps = {
  order: Order;
  isUpdating: boolean;
  onOpenDetails: (order: Order) => void;
  onStatusUpdate: (order: Order, nextStatus: OrderStatus) => void;
};

function OrderCard({
  order,
  isUpdating,
  onOpenDetails,
  onStatusUpdate,
}: OrderCardProps) {
  const createdAt = formatDateTime(order.createdAt);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-ocean">
            {order.trackingCode}
          </p>
          <p className="mt-3 truncate font-black text-ink">
            {order.customerName}
          </p>
        </div>
        <div className="text-right">
          <p className="whitespace-nowrap text-xs font-bold text-slate-500">
            {createdAt ?? "Sem data"}
          </p>
          <p className="mt-3 whitespace-nowrap text-lg font-black text-emerald-700">
            {formatCurrency(order.total)}
          </p>
        </div>
      </div>

      <p className="mt-4 truncate text-sm font-semibold text-slate-600">
        {order.washTypeLabel} - {order.carSizeLabel}
      </p>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
        {order.status === "pending" ? (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onStatusUpdate(order, "in_progress")}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-ocean px-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUpdating ? "Atualizando..." : "Iniciar serviço"}
          </button>
        ) : null}

        {order.status === "in_progress" ? (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onStatusUpdate(order, "finished")}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUpdating ? "Atualizando..." : "Finalizar serviço"}
          </button>
        ) : null}

        {order.status === "finished" ? (
          <span className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Concluído
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onOpenDetails(order)}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-ink"
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}

function BottomStatusBar({
  latestUpdate,
  onRefresh,
}: {
  latestUpdate: string | null;
  onRefresh: () => void;
}) {
  return (
    <section
      data-animate="admin-bottom-bar"
      className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-card sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex items-center gap-2 font-bold">
          <Clock3 className="h-5 w-5 text-slate-500" aria-hidden="true" />
          Última atualização: {latestUpdate ?? "Aguardando pedidos"}
        </p>
        <p className="flex items-center gap-2 font-bold">
          <span
            className="h-3 w-3 rounded-full bg-emerald-600"
            aria-hidden="true"
          />
          Atualização automática ativa
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 font-black text-ink transition hover:border-cyan-300 hover:bg-cyan-50"
      >
        <RefreshCw className="h-5 w-5" aria-hidden="true" />
        Atualizar agora
      </button>
    </section>
  );
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-ocean">
              Detalhes do pedido
            </p>
            <h2 className="mt-1 text-2xl font-black text-ink">
              {order.trackingCode}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-ink transition-colors hover:bg-cyan-50"
            aria-label="Fechar detalhes"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <DetailItem label="Cliente" value={order.customerName} />
          <DetailItem
            label="WhatsApp"
            value={formatPhoneInput(order.customerPhone)}
          />
          <DetailItem
            label="Serviço"
            value={`${order.washTypeLabel} - ${order.carSizeLabel}`}
          />
          <DetailItem
            label="Pagamento"
            value={paymentLabels[order.paymentMethod]}
          />
          <DetailItem label="Status" value={statusLabels[order.status]} />
          <DetailItem
            label="Solicitação"
            value={formatDateTime(order.createdAt) ?? "Sem data"}
          />
        </div>

        <div className="mt-6 rounded-3xl bg-sky-50 p-5">
          <h3 className="font-black text-ink">Extras selecionados</h3>
          {order.selectedExtras.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {order.selectedExtras.map((extra) => (
                <li
                  key={extra.id}
                  className="flex items-center justify-between gap-4 text-sm text-ink"
                >
                  <span>{extra.title}</span>
                  <span className="font-black">
                    {formatCurrency(extra.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Nenhum extra
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <DetailTotal label="Lavagem" value={order.washPrice} />
          <DetailTotal label="Extras" value={order.extrasTotal} />
          <DetailTotal label="Total" value={order.total} isPrimary />
        </div>
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-sky-100 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-black text-ink">{value}</p>
    </div>
  );
}

function DetailTotal({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: number;
  isPrimary?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-4",
        isPrimary ? "bg-ocean text-white" : "bg-sky-50 text-ink",
      ].join(" ")}
    >
      <p className="text-sm font-bold opacity-80">{label}</p>
      <p className="mt-1 text-xl font-black">{formatCurrency(value)}</p>
    </div>
  );
}

type TimestampLike = {
  toDate: () => Date;
};

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as TimestampLike).toDate === "function"
  );
}

function getDateFromValue(value: unknown) {
  if (!value) {
    return null;
  }

  const date = isTimestampLike(value)
    ? value.toDate()
    : new Date(String(value));

  return Number.isNaN(date.getTime()) ? null : date;
}
