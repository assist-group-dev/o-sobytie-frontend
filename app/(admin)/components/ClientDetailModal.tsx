"use client";

import { Modal } from "@/ui/components/Modal";
import { Card } from "@/ui/components/Card";
import { cn } from "@/utils/cn";

interface QuestionnaireData {
  allergies: string;
  dietaryRestrictions: string[];
  physicalLimitations: string[];
  fears: string[];
  fitnessLevel: string;
  activityPreference: string;
  activityTypes: string[];
  timePreference: string[];
  dayPreference: string[];
  medicalContraindications: string;
  additionalInfo: string;
}

interface SubscriptionData {
  premiumLevel: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  tariff: string;
  duration: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  eventDate: string;
  questionnaireCompleted: boolean;
  subscriptionActive: boolean;
  questionnaire?: QuestionnaireData;
  subscription?: SubscriptionData;
}

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const premiumLevelNames: Record<string, string> = {
  elegant: "Элегантный",
  cozy: "Уютный",
  special: "Особенный",
};

export function ClientDetailModal({ isOpen, onClose, client }: ClientDetailModalProps) {
  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Детальная информация о клиенте</h2>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4">Основная информация</h3>
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
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Анкета</p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded inline-block",
                    client.questionnaireCompleted
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  )}
                >
                  {client.questionnaireCompleted ? "Пройдена" : "Не пройдена"}
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Подписка</p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded inline-block",
                    client.subscriptionActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  )}
                >
                  {client.subscriptionActive ? "Активна" : "Не активна"}
                </span>
              </div>
            </div>
          </Card>

          {client.questionnaireCompleted && client.questionnaire && (
            <Card>
              <h3 className="text-lg font-bold mb-4">Данные анкеты</h3>
              <div className="space-y-4">
                {client.questionnaire.allergies && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Аллергии</p>
                    <p className="font-medium">{client.questionnaire.allergies || "Не указаны"}</p>
                  </div>
                )}
                {client.questionnaire.dietaryRestrictions && client.questionnaire.dietaryRestrictions.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Пищевые ограничения</p>
                    <p className="font-medium">{client.questionnaire.dietaryRestrictions.join(", ")}</p>
                  </div>
                )}
                {client.questionnaire.physicalLimitations && client.questionnaire.physicalLimitations.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Физические ограничения</p>
                    <p className="font-medium">{client.questionnaire.physicalLimitations.join(", ")}</p>
                  </div>
                )}
                {client.questionnaire.fears && client.questionnaire.fears.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Страхи и фобии</p>
                    <p className="font-medium">{client.questionnaire.fears.join(", ")}</p>
                  </div>
                )}
                {client.questionnaire.fitnessLevel && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Уровень физической подготовки</p>
                    <p className="font-medium">{client.questionnaire.fitnessLevel}</p>
                  </div>
                )}
                {client.questionnaire.activityPreference && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Предпочтение по формату</p>
                    <p className="font-medium">{client.questionnaire.activityPreference}</p>
                  </div>
                )}
                {client.questionnaire.activityTypes && client.questionnaire.activityTypes.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Интересующие типы активностей</p>
                    <p className="font-medium">{client.questionnaire.activityTypes.join(", ")}</p>
                  </div>
                )}
                {client.questionnaire.timePreference && client.questionnaire.timePreference.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Предпочтительное время</p>
                    <p className="font-medium">{client.questionnaire.timePreference.join(", ")}</p>
                  </div>
                )}
                {client.questionnaire.dayPreference && client.questionnaire.dayPreference.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Предпочтительные дни</p>
                    <p className="font-medium">{client.questionnaire.dayPreference.join(", ")}</p>
                  </div>
                )}
                {client.questionnaire.medicalContraindications && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Медицинские противопоказания</p>
                    <p className="font-medium">{client.questionnaire.medicalContraindications || "Не указаны"}</p>
                  </div>
                )}
                {client.questionnaire.additionalInfo && (
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Дополнительные пожелания</p>
                    <p className="font-medium">{client.questionnaire.additionalInfo || "Не указаны"}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {client.subscriptionActive && client.subscription && (
            <Card>
              <h3 className="text-lg font-bold mb-4">Данные подписки</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Тариф</p>
                    <p className="font-medium">{client.subscription.tariff}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Длительность</p>
                    <p className="font-medium">{client.subscription.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Уровень премиальности</p>
                    <p className="font-medium">
                      {premiumLevelNames[client.subscription.premiumLevel] || client.subscription.premiumLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Телефон</p>
                    <p className="font-medium">{client.subscription.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-1">Адрес доставки</p>
                  <p className="font-medium">
                    {client.subscription.city}, {client.subscription.street}, д. {client.subscription.house}
                    {client.subscription.apartment && `, кв. ${client.subscription.apartment}`}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Дата доставки</p>
                    <p className="font-medium">{client.subscription.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60 mb-1">Время доставки</p>
                    <p className="font-medium">{client.subscription.deliveryTime}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
}


