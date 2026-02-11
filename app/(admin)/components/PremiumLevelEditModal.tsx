"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";
import type { PremiumLevelApi } from "@/app/(admin)/admin/tariffs/page";

export interface PremiumLevelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  premiumLevel: PremiumLevelApi | null;
  onSave: (data: {
    name?: string;
    pricePerMonth?: number;
    multiplier?: number;
    description?: string;
  }) => void;
}

export function PremiumLevelEditModal({
  isOpen,
  onClose,
  premiumLevel,
  onSave,
}: PremiumLevelEditModalProps) {
  const [name, setName] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (premiumLevel) {
      setName(premiumLevel.name ?? "");
      setPricePerMonth(premiumLevel.pricePerMonth ?? 0);
      setMultiplier(premiumLevel.multiplier ?? 1);
      setDescription(premiumLevel.description ?? "");
    }
  }, [premiumLevel]);

  if (!premiumLevel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || undefined,
      pricePerMonth: pricePerMonth >= 0 ? pricePerMonth : undefined,
      multiplier: multiplier >= 0 ? multiplier : undefined,
      description: description.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-0 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh]"
    >
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">
          Редактирование уровня премиальности
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Название
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              />
            </div>

            <div>
              <label htmlFor="pricePerMonth" className="block text-sm font-medium mb-2">
                Цена за месяц (₽)
              </label>
              <input
                id="pricePerMonth"
                type="number"
                min={0}
                step={1}
                value={pricePerMonth === 0 ? "" : pricePerMonth}
                onChange={(e) =>
                  setPricePerMonth(e.target.value === "" ? 0 : Number(e.target.value))
                }
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              />
            </div>

            <div>
              <label htmlFor="multiplier" className="block text-sm font-medium mb-2">
                Множитель
              </label>
              <input
                id="multiplier"
                type="number"
                min={0}
                step={0.1}
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Описание
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                )}
                placeholder="Описание уровня премиальности"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
