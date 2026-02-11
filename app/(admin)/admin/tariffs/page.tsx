"use client";

import { useState, useEffect, useCallback } from "react";
import { Edit } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { DurationEditModal } from "@/app/(admin)/components/DurationEditModal";
import { PremiumLevelEditModal } from "@/app/(admin)/components/PremiumLevelEditModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { API_BASE_URL, BACKEND_URL, fetchWithAuth } from "@/utils/backend";
import { cn } from "@/utils/cn";

export interface DurationApi {
  _id: string;
  name: string;
  months: number;
  discountPercent: number;
  description: string;
  image: string;
  isActive: boolean;
}

export interface PremiumLevelApi {
  _id: string;
  name: string;
  pricePerMonth: number;
  multiplier: number;
  description: string;
  sortOrder?: number;
}

export default function TariffsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [durations, setDurations] = useState<DurationApi[]>([]);
  const [premiumLevels, setPremiumLevels] = useState<PremiumLevelApi[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<DurationApi | null>(null);
  const [selectedPremiumLevel, setSelectedPremiumLevel] = useState<PremiumLevelApi | null>(null);
  const [isDurationEditModalOpen, setIsDurationEditModalOpen] = useState(false);
  const [isPremiumLevelEditModalOpen, setIsPremiumLevelEditModalOpen] = useState(false);
  const [isActivateConfirmOpen, setIsActivateConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDurations = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/tariffs/durations`);
      if (!response.ok) throw new Error("Failed to fetch durations");
      const data = (await response.json()) as DurationApi[];
      setDurations(Array.isArray(data) ? data : []);
    } catch {
      addToast({ type: "error", message: "Ошибка загрузки сроков" });
      setDurations([]);
    }
  }, [addToast]);

  const loadPremiumLevels = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/tariffs/premium-levels`);
      if (!response.ok) throw new Error("Failed to fetch premium levels");
      const data = (await response.json()) as PremiumLevelApi[];
      setPremiumLevels(Array.isArray(data) ? data : []);
    } catch {
      addToast({ type: "error", message: "Ошибка загрузки уровней премиальности" });
      setPremiumLevels([]);
    }
  }, [addToast]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([loadDurations(), loadPremiumLevels()]);
      setLoading(false);
    };
    load();
  }, [loadDurations, loadPremiumLevels]);

  const handleDurationEdit = (duration: DurationApi) => {
    setSelectedDuration(duration);
    setIsDurationEditModalOpen(true);
  };

  const handleDurationSave = async (data: {
    name?: string;
    discountPercent?: number;
    description?: string;
    image?: string;
    isActive?: boolean;
  }, imageFile?: File) => {
    if (!selectedDuration) return;
    try {
      if (imageFile) {
        const form = new FormData();
        if (data.name !== undefined) form.append("name", data.name);
        if (data.discountPercent !== undefined) form.append("discountPercent", String(data.discountPercent));
        if (data.description !== undefined) form.append("description", data.description);
        if (data.isActive !== undefined) form.append("isActive", data.isActive ? "true" : "false");
        form.append("image", imageFile);
        const response = await fetchWithAuth(
          `${API_BASE_URL}/admin/tariffs/durations/${selectedDuration._id}`,
          { method: "PATCH", body: form }
        );
        if (!response.ok) throw new Error("Failed to update");
      } else {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/admin/tariffs/durations/${selectedDuration._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(data.name !== undefined && { name: data.name }),
              ...(data.discountPercent !== undefined && { discountPercent: data.discountPercent }),
              ...(data.description !== undefined && { description: data.description }),
              ...(data.isActive !== undefined && { isActive: data.isActive }),
              ...(data.image !== undefined && { image: data.image }),
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update");
      }
      const getRes = await fetchWithAuth(
        `${API_BASE_URL}/admin/tariffs/durations/${selectedDuration._id}`
      );
      const updated = (await getRes.json()) as DurationApi;
      setDurations((prev) =>
        prev.map((d) => (d._id === selectedDuration._id ? updated : d))
      );
      setSelectedDuration(updated);
      addToast({
        type: "success",
        message: `Срок "${updated.name}" успешно отредактирован`,
      });
      onCloseDurationModal();
    } catch {
      addToast({ type: "error", message: "Ошибка сохранения срока" });
    }
  };

  const onCloseDurationModal = () => {
    setIsDurationEditModalOpen(false);
    setSelectedDuration(null);
  };

  const handlePremiumLevelEdit = (premiumLevel: PremiumLevelApi) => {
    setSelectedPremiumLevel(premiumLevel);
    setIsPremiumLevelEditModalOpen(true);
  };

  const handlePremiumLevelSave = async (data: {
    name?: string;
    pricePerMonth?: number;
    multiplier?: number;
    description?: string;
  }) => {
    if (!selectedPremiumLevel) return;
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/admin/tariffs/premium-levels/${selectedPremiumLevel._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...(data.name !== undefined && { name: data.name }),
            ...(data.pricePerMonth !== undefined && { pricePerMonth: data.pricePerMonth }),
            ...(data.multiplier !== undefined && { multiplier: data.multiplier }),
            ...(data.description !== undefined && { description: data.description }),
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update");
      const getRes = await fetchWithAuth(
        `${API_BASE_URL}/admin/tariffs/premium-levels/${selectedPremiumLevel._id}`
      );
      const updated = (await getRes.json()) as PremiumLevelApi;
      setPremiumLevels((prev) =>
        prev.map((p) => (p._id === selectedPremiumLevel._id ? updated : p))
      );
      setSelectedPremiumLevel(updated);
      addToast({
        type: "success",
        message: `Уровень "${updated.name}" успешно отредактирован`,
      });
      setIsPremiumLevelEditModalOpen(false);
      setSelectedPremiumLevel(null);
    } catch {
      addToast({ type: "error", message: "Ошибка сохранения уровня премиальности" });
    }
  };

  const handleActivateClick = () => {
    setIsActivateConfirmOpen(true);
  };

  const handleActivateConfirm = async () => {
    if (!selectedDuration) return;
    const newActive = !selectedDuration.isActive;
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/admin/tariffs/durations/${selectedDuration._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: newActive }),
        }
      );
      if (!response.ok) throw new Error("Failed to update");
      const updated = (await response.json()) as DurationApi;
      setDurations((prev) =>
        prev.map((d) => (d._id === selectedDuration._id ? updated : d))
      );
      setSelectedDuration(updated);
      addToast({
        type: "success",
        message: `Срок "${updated.name}" ${newActive ? "активирован" : "деактивирован"}`,
      });
      setIsActivateConfirmOpen(false);
      setSelectedDuration(null);
      setIsDurationEditModalOpen(false);
    } catch {
      addToast({ type: "error", message: "Ошибка смены статуса" });
    }
  };

  const durationColumns = [
    { key: "name", label: "Срок", sortable: false },
    {
      key: "discountPercent",
      label: "Скидка",
      sortable: false,
      render: (item: DurationApi) => `${item.discountPercent}%`,
    },
    {
      key: "description",
      label: "Описание",
      sortable: false,
      render: (item: DurationApi) => (
        <span className="text-sm text-[var(--foreground)]/70 line-clamp-2">
          {item.description ?? "Нет описания"}
        </span>
      ),
    },
    {
      key: "image",
      label: "Картинка",
      sortable: false,
      render: (item: DurationApi) => (
        <span className="text-sm text-[var(--foreground)]/70 truncate max-w-[200px]">
          {item.image ? "Загружена" : "Не указана"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Статус",
      sortable: false,
      render: (item: DurationApi) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
          )}
        >
          {item.isActive ? "Активен" : "Отключен"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: DurationApi) => (
        <Button
          variant="text"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDurationEdit(item);
          }}
          className="p-1.5"
          title="Редактировать"
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const premiumColumns = [
    { key: "name", label: "Название", sortable: false },
    {
      key: "pricePerMonth",
      label: "Цена за месяц",
      sortable: false,
      render: (item: PremiumLevelApi) =>
        `${item.pricePerMonth.toLocaleString("ru-RU")} ₽`,
    },
    {
      key: "multiplier",
      label: "Множитель",
      sortable: false,
      render: (item: PremiumLevelApi) => String(item.multiplier),
    },
    {
      key: "description",
      label: "Описание",
      sortable: false,
      render: (item: PremiumLevelApi) => (
        <span className="text-sm text-[var(--foreground)]/70 line-clamp-2">
          {item.description ?? "Нет описания"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: PremiumLevelApi) => (
        <Button
          variant="text"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handlePremiumLevelEdit(item);
          }}
          className="p-1.5"
          title="Редактировать"
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--foreground)]/70">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold uppercase mb-4">Сроки подписки</h2>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={durationColumns} data={durations} />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold uppercase mb-4">Уровни премиальности</h2>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={premiumColumns} data={premiumLevels} />
            </div>
          </Card>
        </div>
      </div>

      <DurationEditModal
        isOpen={isDurationEditModalOpen}
        onClose={onCloseDurationModal}
        duration={selectedDuration}
        backendUrl={BACKEND_URL}
        onSave={handleDurationSave}
        onActivate={handleActivateClick}
      />

      <PremiumLevelEditModal
        isOpen={isPremiumLevelEditModalOpen}
        onClose={() => {
          setIsPremiumLevelEditModalOpen(false);
          setSelectedPremiumLevel(null);
        }}
        premiumLevel={selectedPremiumLevel}
        onSave={handlePremiumLevelSave}
      />

      <ConfirmModal
        isOpen={isActivateConfirmOpen}
        onClose={() => {
          setIsActivateConfirmOpen(false);
          setSelectedDuration(null);
        }}
        onConfirm={handleActivateConfirm}
        title={
          selectedDuration?.isActive
            ? "Подтверждение деактивации"
            : "Подтверждение активации"
        }
        message={`Вы уверены, что хотите ${selectedDuration?.isActive ? "деактивировать" : "активировать"} срок "${selectedDuration?.name}"?`}
        confirmText={
          selectedDuration?.isActive ? "Деактивировать" : "Активировать"
        }
        cancelText="Отмена"
        variant={selectedDuration?.isActive ? "danger" : "default"}
      />
    </div>
  );
}
