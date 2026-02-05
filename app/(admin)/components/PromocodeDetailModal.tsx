"use client";

import { Trash2, Infinity } from "lucide-react";
import { Modal } from "@/ui/components/Modal";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";

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

interface PromocodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promocode: Promocode | null;
  onDelete?: (promocodeId: string) => void;
}

export function PromocodeDetailModal({ isOpen, onClose, promocode, onDelete }: PromocodeDetailModalProps) {
  if (!promocode) return null;

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(promocode.id);
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
                <p className="font-medium text-lg">{promocode.code}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Тариф</p>
                <p className="font-medium">{promocode.tariff}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Срок</p>
                <p className="font-medium">{promocode.duration}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Размер скидки</p>
                <p className="font-medium text-lg text-[var(--color-golden)]">{promocode.discount}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Использование</p>
                {promocode.isUnlimited ? (
                  <div className="flex items-center gap-2">
                    <Infinity className="h-5 w-5 text-[var(--color-golden)]" />
                    <span className="font-medium">Бесконечный</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{promocode.usedCount}/{promocode.limit}</span>
                    <span className="text-xs text-[var(--foreground)]/60">
                      {promocode.usedCount >= (promocode.limit || 0) ? "(Использован)" : "(Доступен)"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Тип</p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded inline-block",
                    promocode.isClient
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  )}
                >
                  {promocode.isClient ? "Клиентский" : "Админский"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {onDelete && (
          <div className="mt-6 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteClick}
              className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Удалить промокод
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

