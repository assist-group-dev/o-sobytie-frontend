"use client";

import { useState, useMemo } from "react";
import { Eye, Infinity, Plus } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { PromocodeDetailModal } from "@/app/(admin)/components/PromocodeDetailModal";
import { PromocodeCreateModal } from "@/app/(admin)/components/PromocodeCreateModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

import promocodesData from "@/app/(admin)/data/promocodes.json";

interface Promocode {
  id: string;
  code: string;
  tariff: string;
  duration: string;
  discount: string;
  isUnlimited: boolean;
  usedCount: number;
  limit: number | null;
  isClient: boolean;
}

const mockPromocodes: Promocode[] = promocodesData as Promocode[];

export default function PromocodesPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [promocodes, setPromocodes] = useState<Promocode[]>(mockPromocodes);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedPromocode, setSelectedPromocode] = useState<Promocode | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [promocodeToDelete, setPromocodeToDelete] = useState<Promocode | null>(null);

  const sortedData = useMemo(
    () => sortData(promocodes, sortKey, sortDirection),
    [promocodes, sortKey, sortDirection]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, sortedData]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (promocode: Promocode) => {
    setSelectedPromocode(promocode);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (promocodeId: string) => {
    const promocode = promocodes.find((p) => p.id === promocodeId);
    if (promocode) {
      setPromocodeToDelete(promocode);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (promocodeToDelete) {
      const deletedCode = promocodeToDelete.code;
      setPromocodes(promocodes.filter((item) => item.id !== promocodeToDelete.id));
      setPromocodeToDelete(null);
      setIsDetailModalOpen(false);
      addToast({
        type: "success",
        message: `Промокод "${deletedCode}" успешно удален`,
      });
    }
  };

  const handleCreate = (data: Omit<Promocode, "id" | "usedCount">) => {
    const newPromocode: Promocode = {
      ...data,
      id: String(promocodes.length + 1),
      usedCount: 0,
    };
    setPromocodes([...promocodes, newPromocode]);
    addToast({
      type: "success",
      message: `Промокод "${newPromocode.code}" успешно создан`,
    });
  };

  const columns = [
    { key: "code", label: "Код", sortable: true },
    { key: "tariff", label: "Тариф", sortable: true },
    { key: "duration", label: "Срок", sortable: true },
    { key: "discount", label: "Размер скидки", sortable: true },
    {
      key: "usage",
      label: "Использование",
      sortable: true,
      render: (item: Promocode) => {
        if (item.isUnlimited) {
          return (
            <Infinity className="h-4 w-4 text-[var(--color-golden)]" />
          );
        }
        return (
          <span className="text-sm font-medium">
            {item.usedCount}/{item.limit}
          </span>
        );
      },
    },
    {
      key: "isClient",
      label: "Тип",
      sortable: true,
      render: (item: Promocode) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.isClient
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
          )}
        >
          {item.isClient ? "Клиентский" : "Админский"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: Promocode) => (
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold uppercase">Промокоды</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Создать промокод
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={paginatedData}
            sortKey={sortKey || undefined}
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
            totalItems={sortedData.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
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
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPromocodeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить промокод "${promocodeToDelete?.code}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />
    </div>
  );
}

