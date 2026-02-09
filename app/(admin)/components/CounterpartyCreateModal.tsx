"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { cn } from "@/utils/cn";

interface Counterparty {
  id: string;
  name: string;
  address: string;
  phone: string;
  contactPerson: string;
  description: string;
  event?: string;
}

interface CounterpartyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Counterparty, "id">) => Promise<void>;
}

export function CounterpartyCreateModal({ isOpen, onClose, onCreate }: CounterpartyCreateModalProps) {
  const [formData, setFormData] = useState<Omit<Counterparty, "id">>({
    name: "",
    address: "",
    phone: "",
    contactPerson: "",
    description: "",
    event: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        address: "",
        phone: "",
        contactPerson: "",
        description: "",
        event: "",
      });
      setIsConfirmCloseOpen(false);
    }
  }, [isOpen]);

  const hasFilledFields = () => {
    return !!(
      formData.name ||
      formData.address ||
      formData.phone ||
      formData.contactPerson ||
      formData.description ||
      formData.event
    );
  };

  const handleClose = () => {
    if (hasFilledFields() && !isLoading) {
      setIsConfirmCloseOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmCloseOpen(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onCreate(formData);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Создание контрагента</h2>

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
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
              Отмена
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <ConfirmModal
      isOpen={isConfirmCloseOpen}
      onClose={() => setIsConfirmCloseOpen(false)}
      onConfirm={handleConfirmClose}
      title="Подтверждение закрытия"
      message="При закрытии все введенные данные будут потеряны. Вы уверены, что хотите закрыть форму?"
      confirmText="Закрыть"
      cancelText="Отмена"
      variant="danger"
    />
    </>
  );
}




