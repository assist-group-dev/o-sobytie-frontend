"use client";

import { useState, useEffect } from "react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
}

const DEFAULT_MESSAGE =
  "Сайт временно закрыт на техническое обслуживание. Мы вернемся в ближайшее время.";

export default function GeneralPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [settings, setSettings] = useState<MaintenanceSettings>({
    enabled: false,
    message: DEFAULT_MESSAGE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/settings`);
        if (response.ok) {
          const data = (await response.json()) as { maintenance: { enabled: boolean; message: string } };
          setSettings({
            enabled: data.maintenance.enabled,
            message: data.maintenance.message ?? DEFAULT_MESSAGE,
          });
        }
      } catch {
        addToast({ type: "error", message: "Ошибка загрузки настроек" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [addToast]);

  const patchSettings = async (payload: { enabled?: boolean; message?: string }) => {
    setIsSaving(true);
    try {
      const body = {
        maintenance: {
          ...(payload.enabled !== undefined && { enabled: payload.enabled }),
          ...(payload.message !== undefined && { message: payload.message }),
        },
      };
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to update");
      const data = (await response.json()) as { maintenance: { enabled: boolean; message: string } };
      setSettings({
        enabled: data.maintenance.enabled,
        message: data.maintenance.message ?? DEFAULT_MESSAGE,
      });
      return true;
    } catch {
      addToast({ type: "error", message: "Ошибка сохранения настроек" });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleMaintenanceToggle = () => {
    if (!settings.enabled) {
      setIsConfirmOpen(true);
    } else {
      patchSettings({ enabled: false, message: settings.message }).then((ok) => {
        if (ok) addToast({ type: "success", message: "Сайт открыт" });
      });
    }
  };

  const handleConfirmEnable = () => {
    setIsConfirmOpen(false);
    patchSettings({ enabled: true, message: settings.message }).then((ok) => {
      if (ok) addToast({ type: "success", message: "Сайт закрыт на обслуживание" });
    });
  };

  const handleSaveMessage = () => {
    patchSettings({ enabled: settings.enabled, message: settings.message }).then((ok) => {
      if (ok) addToast({ type: "success", message: "Сообщение сохранено" });
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold uppercase mb-2">Общие настройки</h1>
        <Card className="p-6">
          <p className="text-[var(--foreground)]/60">Загрузка…</p>
        </Card>
      </div>
    );
  }

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
              disabled={isSaving}
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
              disabled={isSaving}
              className={cn(
                "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                "bg-[var(--background)] text-[var(--foreground)]",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
              )}
              placeholder="Введите текст сообщения, которое увидят пользователи при закрытии сайта на обслуживание"
            />
            <Button
              type="button"
              onClick={handleSaveMessage}
              disabled={isSaving}
              className="mt-2"
            >
              Сохранить сообщение
            </Button>
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
