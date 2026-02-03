"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { DurationEditModal } from "@/app/(admin)/components/DurationEditModal";
import { PremiumLevelEditModal } from "@/app/(admin)/components/PremiumLevelEditModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { cn } from "@/utils/cn";

interface Duration {
  id: string;
  name: string;
  discount: string;
  description: string;
  image: string;
  isActive?: boolean;
}

interface PremiumLevel {
  id: string;
  name: string;
  price: string;
  description: string;
}

const mockDurations: Duration[] = [
  {
    id: "1",
    name: "1 месяц",
    discount: "0%",
    description: "Попробуйте О!СОБЫТИЕ на один месяц. Идеально для первого знакомства.",
    image: "/boxes/Box_1.jpg",
    isActive: true,
  },
  {
    id: "2",
    name: "3 месяца",
    discount: "10%",
    description: "Оптимальный выбор для тех, кто хочет получить максимум впечатлений.",
    image: "/boxes/Box_2.jpg",
    isActive: true,
  },
  {
    id: "3",
    name: "6 месяцев",
    discount: "20%",
    description: "Долгосрочная подписка с максимальной выгодой и разнообразием.",
    image: "/boxes/Box_3.jpg",
    isActive: true,
  },
];

const mockPremiumLevels: PremiumLevel[] = [
  {
    id: "1",
    name: "Элегантный",
    price: "2 990 ₽",
    description: "Премиальное оформление и эксклюзивные впечатления",
  },
  {
    id: "2",
    name: "Уютный",
    price: "2 490 ₽",
    description: "Теплая атмосфера и комфортные впечатления для души",
  },
  {
    id: "3",
    name: "Особенный",
    price: "3 490 ₽",
    description: "Уникальные и незабываемые впечатления высшего уровня",
  },
];

export default function TariffsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [durations, setDurations] = useState<Duration[]>(mockDurations);
  const [premiumLevels, setPremiumLevels] = useState<PremiumLevel[]>(mockPremiumLevels);
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
  const [selectedPremiumLevel, setSelectedPremiumLevel] = useState<PremiumLevel | null>(null);
  const [isDurationEditModalOpen, setIsDurationEditModalOpen] = useState(false);
  const [isPremiumLevelEditModalOpen, setIsPremiumLevelEditModalOpen] = useState(false);
  const [isActivateConfirmOpen, setIsActivateConfirmOpen] = useState(false);

  const handleDurationEdit = (duration: Duration) => {
    setSelectedDuration(duration);
    setIsDurationEditModalOpen(true);
  };

  const handleDurationSave = (data: Partial<Duration>) => {
    if (selectedDuration) {
      setDurations(
        durations.map((item) =>
          item.id === selectedDuration.id ? { ...item, ...data } : item
        )
      );
      addToast({
        type: "success",
        message: `Срок "${selectedDuration.name}" успешно отредактирован`,
      });
    }
  };

  const handlePremiumLevelEdit = (premiumLevel: PremiumLevel) => {
    setSelectedPremiumLevel(premiumLevel);
    setIsPremiumLevelEditModalOpen(true);
  };

  const handlePremiumLevelSave = (data: Partial<PremiumLevel>) => {
    if (selectedPremiumLevel) {
      setPremiumLevels(
        premiumLevels.map((item) =>
          item.id === selectedPremiumLevel.id ? { ...item, ...data } : item
        )
      );
      addToast({
        type: "success",
        message: `Уровень премиальности "${selectedPremiumLevel.name}" успешно отредактирован`,
      });
    }
  };

  const handleActivateClick = () => {
    setIsActivateConfirmOpen(true);
  };

  const handleActivateConfirm = () => {
    if (selectedDuration) {
      const newActiveStatus = !selectedDuration.isActive;
      setDurations(
        durations.map((item) =>
          item.id === selectedDuration.id ? { ...item, isActive: newActiveStatus } : item
        )
      );
      setSelectedDuration({ ...selectedDuration, isActive: newActiveStatus });
      addToast({
        type: "success",
        message: `Срок "${selectedDuration.name}" ${newActiveStatus ? "активирован" : "деактивирован"}`,
      });
    }
  };

  const durationColumns = [
    { key: "name", label: "Срок", sortable: false },
    { key: "discount", label: "Скидка", sortable: false },
    {
      key: "description",
      label: "Описание",
      sortable: false,
      render: (item: Duration) => (
        <span className="text-sm text-[var(--foreground)]/70 line-clamp-2">
          {item.description || "Нет описания"}
        </span>
      ),
    },
    {
      key: "image",
      label: "Картинка",
      sortable: false,
      render: (item: Duration) => (
        <span className="text-sm text-[var(--foreground)]/70 truncate max-w-[200px]">
          {item.image || "Не указана"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Статус",
      sortable: false,
      render: (item: Duration) => (
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
      render: (item: Duration) => (
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
    { key: "price", label: "Цена", sortable: false },
    {
      key: "description",
      label: "Описание",
      sortable: false,
      render: (item: PremiumLevel) => (
        <span className="text-sm text-[var(--foreground)]/70 line-clamp-2">
          {item.description || "Нет описания"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: PremiumLevel) => (
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

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold uppercase mb-4">Сроки подписки</h2>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                columns={durationColumns}
                data={durations}
              />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold uppercase mb-4">Уровни премиальности</h2>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                columns={premiumColumns}
                data={premiumLevels}
              />
            </div>
          </Card>
        </div>
      </div>

      <DurationEditModal
        isOpen={isDurationEditModalOpen}
        onClose={() => setIsDurationEditModalOpen(false)}
        duration={selectedDuration}
        onSave={handleDurationSave}
        onActivate={handleActivateClick}
      />

      <PremiumLevelEditModal
        isOpen={isPremiumLevelEditModalOpen}
        onClose={() => setIsPremiumLevelEditModalOpen(false)}
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
        title={selectedDuration?.isActive ? "Подтверждение деактивации" : "Подтверждение активации"}
        message={`Вы уверены, что хотите ${selectedDuration?.isActive ? "деактивировать" : "активировать"} срок "${selectedDuration?.name}"?`}
        confirmText={selectedDuration?.isActive ? "Деактивировать" : "Активировать"}
        cancelText="Отмена"
        variant={selectedDuration?.isActive ? "danger" : "default"}
      />
    </div>
  );
}

