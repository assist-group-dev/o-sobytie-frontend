"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";

interface Counterparty {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  contactPerson?: string;
  description?: string;
  event?: string;
}

interface CounterpartyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterparty: Counterparty | null;
  onSave: (data: Partial<Counterparty>) => void;
  onDelete?: () => void;
}

export function CounterpartyEditModal({ isOpen, onClose, counterparty, onSave, onDelete }: CounterpartyEditModalProps) {
  const [formData, setFormData] = useState<Partial<Counterparty>>({
    name: "",
    address: "",
    phone: "",
    contactPerson: "",
    description: "",
    event: "",
  });

  useEffect(() => {
    if (counterparty) {
      setFormData({
        name: counterparty.name || "",
        address: counterparty.address || "",
        phone: counterparty.phone || "",
        contactPerson: counterparty.contactPerson || "",
        description: counterparty.description || "",
        event: counterparty.event || "",
      });
    }
  }, [counterparty]);

  if (!counterparty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Редактирование контрагента</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="event" className="block text-sm font-medium mb-2">
                Событие
              </label>
              <input
                id="event"
                type="text"
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                placeholder="Например: квест, свидание, мастер-класс"
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
              />
            </div>

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
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Адрес
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Номер телефона
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
              />
            </div>

            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium mb-2">
                Имя контактного лица
              </label>
              <input
                id="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                )}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            {onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onDelete) {
                    onDelete();
                  }
                }}
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Удалить
              </Button>
            )}
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

