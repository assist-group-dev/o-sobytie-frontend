"use client";

import { Modal } from "@/ui/components/Modal";
import { Card } from "@/ui/components/Card";

interface Counterparty {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  contactPerson?: string;
  description?: string;
  event?: string;
}

interface CounterpartyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterparty: Counterparty | null;
}

export function CounterpartyDetailModal({ isOpen, onClose, counterparty }: CounterpartyDetailModalProps) {
  if (!counterparty) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Детальная информация о контрагенте</h2>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Событие</p>
                <p className="font-medium">{counterparty.event || "Не указано"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Название</p>
                <p className="font-medium">{counterparty.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Номер телефона</p>
                <p className="font-medium">{counterparty.phone || "Не указан"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Адрес</p>
                <p className="font-medium">{counterparty.address || "Не указан"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Имя контактного лица</p>
                <p className="font-medium">{counterparty.contactPerson || "Не указано"}</p>
              </div>
            </div>
          </Card>

          {counterparty.description && (
            <Card>
              <h3 className="text-lg font-bold mb-4">Описание</h3>
              <p className="text-[var(--foreground)] whitespace-pre-wrap">{counterparty.description}</p>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
}




