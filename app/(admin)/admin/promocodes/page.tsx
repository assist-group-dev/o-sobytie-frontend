"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Eye, Infinity, Plus } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { PromocodeDetailModal } from "@/app/(admin)/components/PromocodeDetailModal";
import { PromocodeCreateModal } from "@/app/(admin)/components/PromocodeCreateModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

export interface PromocodeFromApi {
  id: string;
  code: string;
  type: "admin" | "gift";
  discountPercent: number;
  durationId: string;
  durationName: string;
  premiumLevelName: string;
  maxActivations: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

type TypeFilter = "all" | "admin" | "gift";

export default function PromocodesPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [promocodes, setPromocodes] = useState<PromocodeFromApi[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedPromocode, setSelectedPromocode] = useState<PromocodeFromApi | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPromocodes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(itemsPerPage));
      if (typeFilter !== "all") params.set("type", typeFilter);
      const response = await fetchWithAuth(
        `${API_BASE_URL}/admin/promocodes?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch promocodes");
      const data = (await response.json()) as { items: PromocodeFromApi[]; total: number };
      setPromocodes(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch {
      addToast({ type: "error", message: "Ошибка загрузки промокодов" });
      setPromocodes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, typeFilter, addToast]);

  useEffect(() => {
    fetchPromocodes();
  }, [fetchPromocodes]);

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const sortedData = useMemo(
    () => sortData(promocodes, sortKey, sortDirection),
    [promocodes, sortKey, sortDirection]
  );

  const handleView = (promocode: PromocodeFromApi) => {
    setSelectedPromocode(promocode);
    setIsDetailModalOpen(true);
  };

  const handleCreate = async (data: {
    code?: string;
    generateCode: boolean;
    discountPercent: number;
    durationId: string;
    maxActivations: number | null;
    expiresAt: string | null;
  }) => {
    try {
      const body: Record<string, unknown> = {
        discountPercent: data.discountPercent,
        durationId: data.durationId,
        maxActivations: data.maxActivations,
        generateCode: data.generateCode,
      };
      if (data.expiresAt != null && data.expiresAt !== "") {
        body.expiresAt = data.expiresAt;
      }
      if (data.code != null && data.code.trim() !== "") {
        body.code = data.code.trim();
        body.generateCode = false;
      }
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/promocodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Ошибка создания");
      }
      addToast({ type: "success", message: "Промокод успешно создан" });
      setIsCreateModalOpen(false);
      fetchPromocodes();
    } catch (e) {
      addToast({
        type: "error",
        message: e instanceof Error ? e.message : "Ошибка создания промокода",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/promocodes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update");
      addToast({
        type: "success",
        message: isActive ? "Промокод активирован" : "Промокод деактивирован",
      });
      setSelectedPromocode((prev) => (prev?.id === id ? { ...prev, isActive } : prev));
      fetchPromocodes();
    } catch {
      addToast({ type: "error", message: "Ошибка обновления промокода" });
    }
  };

  const columns = [
    { key: "code", label: "Код", sortable: true },
    { key: "premiumLevelName", label: "Тариф", sortable: true },
    { key: "durationName", label: "Срок", sortable: true },
    {
      key: "discountPercent",
      label: "Скидка",
      sortable: true,
      render: (item: PromocodeFromApi) => (
        <span className="font-medium text-[var(--color-golden)]">{item.discountPercent}%</span>
      ),
    },
    {
      key: "usage",
      label: "Использование",
      sortable: false,
      render: (item: PromocodeFromApi) => {
        if (item.maxActivations == null) {
          return <Infinity className="h-4 w-4 text-[var(--color-golden)]" />;
        }
        return (
          <span className="text-sm font-medium">
            {item.usedCount}/{item.maxActivations}
          </span>
        );
      },
    },
    {
      key: "type",
      label: "Тип",
      sortable: true,
      render: (item: PromocodeFromApi) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.type === "gift"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
          )}
        >
          {item.type === "gift" ? "Клиентский" : "Админский"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Статус",
      sortable: true,
      render: (item: PromocodeFromApi) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
          )}
        >
          {item.isActive ? "Активен" : "Неактивен"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: PromocodeFromApi) => (
        <div className="flex items-center gap-2">
          <Button
            variant="text"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleView(item);
            }}
            className="p-1.5"
            title="Просмотр"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold uppercase">Промокоды</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TypeFilter);
              setCurrentPage(1);
            }}
            className={cn(
              "px-3 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
              "bg-[var(--background)] text-[var(--foreground)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50"
            )}
          >
            <option value="all">Все</option>
            <option value="admin">Админские</option>
            <option value="gift">Клиентские</option>
          </select>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center sm:gap-2 sm:px-5 sm:py-2.5 px-3 py-3"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Создать промокод</span>
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--foreground)]/60">Загрузка…</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={sortedData}
                sortKey={sortKey ?? undefined}
                sortDirection={sortDirection}
                onSort={handleSort}
                onRowClick={handleView}
              />
            </div>
            <div className="p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={total}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 20, 50, 100]}
              />
            </div>
          </>
        )}
      </Card>

      <PromocodeCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <PromocodeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        promocode={selectedPromocode}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}
