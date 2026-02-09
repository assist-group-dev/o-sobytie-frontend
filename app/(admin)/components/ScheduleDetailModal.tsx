"use client";

import { useState } from "react";
import { Modal } from "@/ui/components/Modal";
import { Card } from "@/ui/components/Card";
import { ClientDetailModal } from "@/app/(admin)/components/ClientDetailModal";
import { CounterpartyDetailModal } from "@/app/(admin)/components/CounterpartyDetailModal";

interface Client {
  id: string;
  name: string;
  email: string;
  eventDate: string;
  questionnaireCompleted: boolean;
  subscriptionActive: boolean;
  questionnaire: any;
  subscription: any;
}

interface Counterparty {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  contactPerson?: string;
  description?: string;
  event?: string;
}

interface ScheduleEvent {
  id: string;
  clientId: string;
  counterpartyId: string;
  date: string;
  time: string;
  amount: string;
}

interface ScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  client: Client | null;
  counterparty: Counterparty | null;
}

export function ScheduleDetailModal({
  isOpen,
  onClose,
  event,
  client,
  counterparty,
}: ScheduleDetailModalProps) {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);

  if (!event) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold uppercase mb-6">Детальная информация о мероприятии</h2>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold mb-4">Информация о мероприятии</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-1">Дата</p>
                  <p className="font-medium">{event.date}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-1">Время</p>
                  <p className="font-medium">{event.time}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-1">Сумма</p>
                  <p className="font-medium text-lg text-[var(--color-golden)]">
                    {parseInt(event.amount).toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
            </Card>

            {client && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Информация о клиенте</h3>
                  <button
                    onClick={() => setIsClientModalOpen(true)}
                    className="text-sm text-[var(--color-golden)] hover:underline"
                  >
                    Подробнее
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Имя</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Дата мероприятия</p>
                    <p className="font-medium">{client.eventDate || "Не указана"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Анкета заполнена</p>
                    <p className="font-medium">
                      {client.questionnaireCompleted ? "Да" : "Нет"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {counterparty && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Информация о контрагенте</h3>
                  <button
                    onClick={() => setIsCounterpartyModalOpen(true)}
                    className="text-sm text-[var(--color-golden)] hover:underline"
                  >
                    Подробнее
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Название</p>
                    <p className="font-medium">{counterparty.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Телефон</p>
                    <p className="font-medium">{counterparty.phone || "Не указан"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Адрес</p>
                    <p className="font-medium">{counterparty.address || "Не указан"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Контактное лицо</p>
                    <p className="font-medium">{counterparty.contactPerson || "Не указано"}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Modal>

      {client && (
        <ClientDetailModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          client={client}
        />
      )}

      {counterparty && (
        <CounterpartyDetailModal
          isOpen={isCounterpartyModalOpen}
          onClose={() => setIsCounterpartyModalOpen(false)}
          counterparty={counterparty}
        />
      )}
    </>
  );
}

