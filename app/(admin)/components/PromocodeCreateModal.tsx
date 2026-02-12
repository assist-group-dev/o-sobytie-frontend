"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface DurationOption {
  _id: string;
  name: string;
  months: number;
}

export interface PromocodeCreatePayload {
  code?: string;
  generateCode: boolean;
  discountPercent: number;
  durationId: string;
  maxActivations: number | null;
  expiresAt: string | null;
}

interface PromocodeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: PromocodeCreatePayload) => void;
}

const CODE_REGEX = /^[A-Za-z0-9]{3,50}$/;

export function PromocodeCreateModal({ isOpen, onClose, onCreate }: PromocodeCreateModalProps) {
  const [codeGenerationType, setCodeGenerationType] = useState<"random" | "manual">("random");
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [durationId, setDurationId] = useState("");
  const [maxActivations, setMaxActivations] = useState<number | null>(10);
  const [expiresAt, setExpiresAt] = useState("");
  const [durations, setDurations] = useState<DurationOption[]>([]);
  const [codeError, setCodeError] = useState<string | null>(null);

  const loadDurations = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/tariffs/durations`);
      if (!response.ok) return;
      const data = (await response.json()) as DurationOption[];
      setDurations(Array.isArray(data) ? data : []);
      if (data?.length > 0 && !durationId) {
        setDurationId(data[0]._id);
      }
    } catch {
      setDurations([]);
    }
  }, [durationId]);

  useEffect(() => {
    if (isOpen) {
      loadDurations();
      setCode("");
      setCodeGenerationType("random");
      setDiscountPercent(10);
      setMaxActivations(10);
      setExpiresAt("");
      setCodeError(null);
    }
  }, [isOpen, loadDurations]);

  useEffect(() => {
    if (isOpen && durations.length > 0 && !durationId) {
      setDurationId(durations[0]._id);
    }
  }, [isOpen, durations, durationId]);

  const validateCode = (value: string): boolean => {
    if (value.length < 3 || value.length > 50) {
      setCodeError("Код должен быть от 3 до 50 символов");
      return false;
    }
    if (!CODE_REGEX.test(value)) {
      setCodeError("Только латинские буквы и цифры");
      return false;
    }
    setCodeError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeGenerationType === "manual") {
      if (!validateCode(code.trim())) return;
    }
    onCreate({
      code: codeGenerationType === "manual" ? code.trim() : undefined,
      generateCode: codeGenerationType === "random",
      discountPercent,
      durationId,
      maxActivations,
      expiresAt: expiresAt !== "" ? expiresAt : null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Создание админского промокода</h2>

        <p className="text-sm text-[var(--foreground)]/70 mb-4">Тариф: Уютный (фиксировано)</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Способ задания кода</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="codeType"
                    value="random"
                    checked={codeGenerationType === "random"}
                    onChange={() => {
                      setCodeGenerationType("random");
                      setCodeError(null);
                    }}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Случайная генерация (на сервере)</span>
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
              {codeGenerationType === "manual" && (
                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/[^A-Za-z0-9]/g, ""));
                      setCodeError(null);
                    }}
                    placeholder="3–50 символов, латиница и цифры"
                    maxLength={50}
                    className={cn(
                      "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                      codeError && "border-red-500"
                    )}
                  />
                  {codeError && <p className="text-sm text-red-500 mt-1">{codeError}</p>}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                Срок
              </label>
              <select
                id="duration"
                value={durationId}
                onChange={(e) => setDurationId(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              >
                <option value="">—</option>
                {durations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.months} мес.)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="discount" className="block text-sm font-medium">
                  Размер скидки (%)
                </label>
                <span className="text-lg font-bold text-[var(--color-golden)]">{discountPercent}%</span>
              </div>
              <input
                id="discount"
                type="range"
                min="0"
                max="100"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className={cn(
                  "w-full h-2 bg-[var(--color-cream)] dark:bg-[var(--color-cream)]/30 rounded-lg appearance-none cursor-pointer",
                  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-golden)] [&::-webkit-slider-thumb]:cursor-pointer",
                  "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-golden)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Количество активаций</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usageType"
                    value="limited"
                    checked={maxActivations != null}
                    onChange={() => setMaxActivations(10)}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Ограничено</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usageType"
                    value="unlimited"
                    checked={maxActivations === null}
                    onChange={() => setMaxActivations(null)}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Без лимита</span>
                </label>
              </div>
              {maxActivations != null && (
                <input
                  type="number"
                  min={1}
                  value={maxActivations}
                  onChange={(e) => setMaxActivations(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={cn(
                    "mt-2 w-32 px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50"
                  )}
                />
              )}
            </div>

            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium mb-2">
                Срок действия (необязательно)
              </label>
              <input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
              />
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
