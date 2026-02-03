"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { X, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

interface PremiumLevel {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface Tariff {
  id: string;
  name: string;
  duration: string;
  durationDescription: string;
  isActive: boolean;
  premiumLevels: PremiumLevel[];
  image: string;
}

interface TariffEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: Tariff | null;
  onSave: (data: Partial<Tariff>) => void;
}

export function TariffEditModal({ isOpen, onClose, tariff, onSave }: TariffEditModalProps) {
  const [formData, setFormData] = useState<Partial<Tariff>>({
    name: "",
    durationDescription: "",
    isActive: true,
    premiumLevels: [],
    image: "",
  });

  useEffect(() => {
    if (tariff) {
      setFormData({
        name: tariff.name || "",
        durationDescription: tariff.durationDescription || "",
        isActive: tariff.isActive ?? true,
        premiumLevels: tariff.premiumLevels || [],
        image: tariff.image || "",
      });
    }
  }, [tariff]);

  if (!tariff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      duration: tariff?.duration,
    };
    onSave(dataToSave);
    onClose();
  };

  const handleAddPremiumLevel = () => {
    const newLevel: PremiumLevel = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      description: "",
      price: "",
    };
    setFormData({
      ...formData,
      premiumLevels: [...(formData.premiumLevels || []), newLevel],
    });
  };

  const handleRemovePremiumLevel = (id: string) => {
    setFormData({
      ...formData,
      premiumLevels: formData.premiumLevels?.filter((level) => level.id !== id) || [],
    });
  };

  const handlePremiumLevelChange = (id: string, field: keyof PremiumLevel, value: string) => {
    setFormData({
      ...formData,
      premiumLevels: formData.premiumLevels?.map((level) =>
        level.id === id ? { ...level, [field]: value } : level
      ) || [],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Редактирование тарифа</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Название
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              />
            </div>

            <div>
              <label htmlFor="durationDescription" className="block text-sm font-medium mb-2">
                Описание продолжительности
              </label>
              <textarea
                id="durationDescription"
                value={formData.durationDescription}
                onChange={(e) => setFormData({ ...formData, durationDescription: e.target.value })}
                rows={4}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                )}
                placeholder="Подробное описание продолжительности тарифа"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">
                URL картинки
              </label>
              <input
                id="image"
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                placeholder="/boxes/Box_1.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Тариф активен
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Уровни премиальности</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPremiumLevel}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить уровень
                </Button>
              </div>

              <div className="space-y-4">
                {formData.premiumLevels?.map((level, index) => (
                  <div
                    key={level.id}
                    className="p-4 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Уровень {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemovePremiumLevel(level.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        aria-label="Удалить уровень"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Название</label>
                      <input
                        type="text"
                        value={level.name}
                        onChange={(e) => handlePremiumLevelChange(level.id, "name", e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 text-sm border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                        placeholder="Например: Элегантный"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Описание</label>
                      <textarea
                        value={level.description}
                        onChange={(e) => handlePremiumLevelChange(level.id, "description", e.target.value)}
                        rows={2}
                        className={cn(
                          "w-full px-3 py-2 text-sm border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                        )}
                        placeholder="Описание уровня премиальности"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Цена</label>
                      <input
                        type="text"
                        value={level.price}
                        onChange={(e) => handlePremiumLevelChange(level.id, "price", e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 text-sm border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                        placeholder="Например: 2 990 ₽"
                      />
                    </div>
                  </div>
                ))}

                {(!formData.premiumLevels || formData.premiumLevels.length === 0) && (
                  <p className="text-sm text-[var(--foreground)]/50 text-center py-4">
                    Нет уровней премиальности. Нажмите "Добавить уровень" для создания.
                  </p>
                )}
              </div>
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

