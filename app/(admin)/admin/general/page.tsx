"use client";

import { useState } from "react";
import { Card } from "@/ui/components/Card";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { cn } from "@/utils/cn";

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
}

const defaultSettings: MaintenanceSettings = {
  enabled: false,
  message: "Сайт временно закрыт на техническое обслуживание. Мы вернемся в ближайшее время.",
};

export default function GeneralPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleMaintenanceToggle = () => {
    if (!settings.enabled) {
      // Включение - показываем подтверждение
      setIsConfirmOpen(true);
    } else {
      // Выключение - сразу применяем
      setSettings((prev) => ({
        ...prev,
        enabled: false,
      }));
      addToast({
        type: "success",
        message: "Сайт открыт",
      });
    }
  };

  const handleConfirmEnable = () => {
    setSettings((prev) => ({
      ...prev,
      enabled: true,
    }));
    setIsConfirmOpen(false);
    addToast({
      type: "success",
      message: "Сайт закрыт на обслуживание",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase mb-2">Общие настройки</h1>
        <p className="text-sm text-[var(--foreground)]/60">
          Управление общими настройками сайта
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Закрытие сайта на обслуживание</h3>
              <p className="text-sm text-[var(--foreground)]/60">
                При включении сайт будет недоступен для пользователей
              </p>
            </div>
            <button
              onClick={handleMaintenanceToggle}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                settings.enabled
                  ? "bg-red-500"
                  : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  settings.enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Текст сообщения для пользователей
            </label>
            <textarea
              value={settings.message}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              rows={3}
              className={cn(
                "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                "bg-[var(--background)] text-[var(--foreground)]",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
              )}
              placeholder="Введите текст сообщения, которое увидят пользователи при закрытии сайта на обслуживание"
            />
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmEnable}
        title="Подтверждение включения режима обслуживания"
        message="Вы уверены, что хотите закрыть сайт на обслуживание? Все пользователи не смогут получить доступ к сайту до тех пор, пока режим обслуживания не будет отключен."
        confirmText="Включить обслуживание"
        cancelText="Отмена"
        variant="danger"
      />
    </div>
  );
}
