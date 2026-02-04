"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Modal } from "@/ui/components/Modal";
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

interface PromocodeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Promocode, "id" | "usedCount">) => void;
}

const TARIFF_OPTIONS = ["Элегантный", "Уютный", "Особенный"];
const DURATION_OPTIONS = ["1 месяц", "3 месяца", "6 месяцев"];

const generateRandomCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function PromocodeCreateModal({ isOpen, onClose, onCreate }: PromocodeCreateModalProps) {
  const [codeGenerationType, setCodeGenerationType] = useState<"random" | "manual">("random");
  const [formData, setFormData] = useState<Omit<Promocode, "id" | "usedCount">>({
    code: "",
    tariff: "Элегантный",
    duration: "1 месяц",
    discount: "",
    isUnlimited: false,
    limit: 1,
    isClient: false,
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        code: "",
        tariff: "Элегантный",
        duration: "1 месяц",
        discount: "5",
        isUnlimited: false,
        limit: 1,
        isClient: false,
      });
      setCodeGenerationType("random");
    } else if (codeGenerationType === "random") {
      setFormData((prev) => ({ ...prev, code: generateRandomCode() }));
    }
  }, [isOpen, codeGenerationType]);

  const handleGenerateCode = () => {
    setFormData((prev) => ({ ...prev, code: generateRandomCode() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      limit: formData.isUnlimited ? null : formData.limit,
    };
    onCreate(finalData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Создание админского промокода</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Способ создания кода</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="codeType"
                    value="random"
                    checked={codeGenerationType === "random"}
                    onChange={() => {
                      setCodeGenerationType("random");
                      setFormData((prev) => ({ ...prev, code: generateRandomCode() }));
                    }}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Случайная генерация</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="codeType"
                    value="manual"
                    checked={codeGenerationType === "manual"}
                    onChange={() => setCodeGenerationType("manual")}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Ручной ввод</span>
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  disabled={codeGenerationType === "random"}
                  placeholder={codeGenerationType === "random" ? "Код будет сгенерирован" : "Введите код"}
                  className={cn(
                    "flex-1 px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                    codeGenerationType === "random" && "opacity-50 cursor-not-allowed"
                  )}
                  required
                />
                {codeGenerationType === "random" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateCode}
                    className="shrink-0"
                    title="Сгенерировать новый код"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="tariff" className="block text-sm font-medium mb-2">
                Тариф
              </label>
              <select
                id="tariff"
                value={formData.tariff}
                onChange={(e) => setFormData({ ...formData, tariff: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              >
                {TARIFF_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                Срок
              </label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="discount" className="block text-sm font-medium">
                  Размер скидки
                </label>
                <span className="text-lg font-bold text-[var(--color-golden)]">
                  {formData.discount || "5"}%
                </span>
              </div>
              <input
                id="discount"
                type="range"
                min="5"
                max="100"
                step="5"
                value={formData.discount || "5"}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className={cn(
                  "w-full h-2 bg-[var(--color-cream)] dark:bg-[var(--color-cream)]/30 rounded-lg appearance-none cursor-pointer",
                  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-golden)] [&::-webkit-slider-thumb]:cursor-pointer",
                  "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-golden)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                )}
                required
              />
              <div className="flex justify-between text-xs text-[var(--foreground)]/50 mt-1">
                <span>5%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Тип использования</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usageType"
                    value="single"
                    checked={!formData.isUnlimited}
                    onChange={() => setFormData({ ...formData, isUnlimited: false, limit: 1 })}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Одноразовый</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usageType"
                    value="unlimited"
                    checked={formData.isUnlimited}
                    onChange={() => setFormData({ ...formData, isUnlimited: true, limit: null })}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Бесконечный</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Создать промокод
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

