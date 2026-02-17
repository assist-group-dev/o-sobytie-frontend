"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/ui/components/Card";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface PaymentItem {
  id: string;
  orderId: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  subscriptionActivated?: boolean;
  subscriptionId?: string;
  giftPromocodeCreated?: boolean;
  giftCode?: string;
}

type TypeFilter = "all" | "subscription" | "gift";
type StatusFilter = "all" | string;

export default function PaymentsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(itemsPerPage));
      params.set("offset", String((currentPage - 1) * itemsPerPage));
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all" && statusFilter.trim() !== "") params.set("status", statusFilter);
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/payments?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = (await response.json()) as { items: PaymentItem[]; total: number };
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch {
      addToast({ type: "error", message: "Ошибка загрузки платежей" });
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, typeFilter, statusFilter, addToast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const formatAmount = (amount: number, currency: string) => {
    const rub = amount / 100;
    return `${rub.toLocaleString("ru-RU")} ${currency === "RUB" ? "₽" : currency}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const columns = [
    { key: "orderId", label: "Заказ", sortable: false },
    {
      key: "user",
      label: "Пользователь",
      sortable: false,
      render: (item: PaymentItem) => (
        <div className="text-sm">
          <div>{item.userEmail ?? item.userId}</div>
          {item.userName != null && item.userName !== "" && (
            <div className="text-[var(--foreground)]/70">{item.userName}</div>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: "Тип",
      sortable: false,
      render: (item: PaymentItem) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.type === "gift"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
          )}
        >
          {item.type === "gift" ? "Подарок" : "Подписка"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Статус",
      sortable: false,
      render: (item: PaymentItem) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.status === "CONFIRMED"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : item.status === "REJECTED" || item.status === "REFUNDED" || item.status === "REVERSED"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
          )}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Сумма",
      sortable: false,
      render: (item: PaymentItem) => (
        <span className="font-medium">{formatAmount(item.amount, item.currency)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Дата",
      sortable: false,
      render: (item: PaymentItem) => <span className="text-sm text-[var(--foreground)]/80">{formatDate(item.createdAt)}</span>,
    },
    {
      key: "result",
      label: "Результат",
      sortable: false,
      render: (item: PaymentItem) => {
        if (item.type === "subscription") {
          return item.subscriptionActivated ? (
            <span className="text-green-600 dark:text-green-400 text-sm">Подписка оформлена</span>
          ) : (
            <span className="text-[var(--foreground)]/60 text-sm">—</span>
          );
        }
        return item.giftPromocodeCreated && item.giftCode != null ? (
          <span className="text-sm font-mono break-all">{item.giftCode}</span>
        ) : (
          <span className="text-[var(--foreground)]/60 text-sm">—</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold uppercase">Платежи</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TypeFilter);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 rounded-md bg-[var(--background)] text-[var(--foreground)]"
          >
            <option value="all">Все типы</option>
            <option value="subscription">Подписка</option>
            <option value="gift">Подарок</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 rounded-md bg-[var(--background)] text-[var(--foreground)]"
          >
            <option value="all">Все статусы</option>
            <option value="NEW">NEW</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="AUTHORIZED">AUTHORIZED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="REVERSED">REVERSED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--foreground)]/70">Загрузка…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-[var(--foreground)]/70">Платежей не найдено</div>
        ) : (
          <>
            <Table columns={columns} data={items} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(n) => {
                setItemsPerPage(n);
                setCurrentPage(1);
              }}
              totalItems={total}
            />
          </>
        )}
      </Card>
    </div>
  );
}
