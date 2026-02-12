"use client";

import { Power, PowerOff } from "lucide-react";
import { Modal } from "@/ui/components/Modal";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";
import type { PromocodeFromApi } from "@/app/(admin)/admin/promocodes/page";

interface PromocodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promocode: PromocodeFromApi | null;
  onToggleActive?: (id: string, isActive: boolean) => void;
}

export function PromocodeDetailModal({
  isOpen,
  onClose,
  promocode,
  onToggleActive,
}: PromocodeDetailModalProps) {
  if (!promocode) return null;

  const handleToggle = () => {
    if (onToggleActive) {
      onToggleActive(promocode.id, !promocode.isActive);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Детальная информация о промокоде</h2>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Код</p>
                <p className="font-medium text-lg font-mono">{promocode.code}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Тип</p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded inline-block",
                    promocode.type === "gift"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  )}
                >
                  {promocode.type === "gift" ? "Клиентский" : "Админский"}
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Тариф</p>
                <p className="font-medium">{promocode.premiumLevelName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Срок</p>
                <p className="font-medium">{promocode.durationName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Размер скидки</p>
                <p className="font-medium text-lg text-[var(--color-golden)]">{promocode.discountPercent}%</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Использование</p>
                <p className="font-medium">
                  {promocode.maxActivations == null
                    ? "Без лимита"
                    : `${promocode.usedCount} / ${promocode.maxActivations}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Статус</p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded inline-block",
                    promocode.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  )}
                >
                  {promocode.isActive ? "Активен" : "Неактивен"}
                </span>
              </div>
              {promocode.expiresAt != null && promocode.expiresAt !== "" && (
                <div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-1">Срок действия до</p>
                  <p className="font-medium">
                    {new Date(promocode.expiresAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Дата создания</p>
                <p className="font-medium">
                  {new Date(promocode.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {onToggleActive && promocode.type === "admin" && (
          <div className="mt-6 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleToggle}
              className={cn(
                "flex items-center justify-center gap-2",
                promocode.isActive
                  ? "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
              )}
            >
              {promocode.isActive ? (
                <>
                  <PowerOff className="h-4 w-4" />
                  Деактивировать
                </>
              ) : (
                <>
                  <Power className="h-4 w-4" />
                  Активировать
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
