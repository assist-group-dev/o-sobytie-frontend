"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { Check, Ban } from "lucide-react";
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
  eventDate?: string;
  questionnaireCompleted?: boolean;
  subscriptionActive?: boolean;
  banned?: boolean;
  questionnaire?: QuestionnaireData;
  subscription?: SubscriptionData;
}

interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onSave: (data: Partial<Client>) => void;
  onBan?: () => void;
  onDelete?: () => void;
  onRevokeAdminRights?: () => void;
  deleteButtonText?: string;
}

const dietaryOptions = ["Вегетарианство", "Веганство", "Халяль", "Кошер", "Без глютена", "Без лактозы"];
const physicalLimitationOptions = ["Проблемы с суставами", "Проблемы со спиной", "Ограниченная подвижность", "Другое"];
const fearOptions = ["Высота", "Вода", "Закрытые пространства", "Темнота", "Толпа", "Другое"];
const fitnessLevelOptions = ["Низкий", "Средний", "Высокий"];
const activityPreferenceOptions = ["Спокойный формат", "Активный формат", "Смешанный"];
const activityTypeOptions = ["Мастер-классы", "Спорт", "Искусство", "Кулинария", "Природа", "Развлечения", "Образование"];
const timePreferenceOptions = ["Утро", "День", "Вечер"];
const dayPreferenceOptions = ["Будни", "Выходные", "Любые дни"];
const premiumLevelOptions = [
  { id: "elegant", name: "Элегантный" },
  { id: "cozy", name: "Уютный" },
  { id: "special", name: "Особенный" },
];
const deliveryTimeSlots = [
  { value: "09:00-12:00", label: "09:00 - 12:00" },
  { value: "12:00-15:00", label: "12:00 - 15:00" },
  { value: "15:00-18:00", label: "15:00 - 18:00" },
  { value: "18:00-21:00", label: "18:00 - 21:00" },
];

export function ClientEditModal({ isOpen, onClose, client, onSave, onBan, onDelete, onRevokeAdminRights, deleteButtonText = "Удалить" }: ClientEditModalProps) {
  const [activeTab, setActiveTab] = useState<"main" | "questionnaire" | "subscription">("main");
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    email: "",
    eventDate: "",
    questionnaireCompleted: false,
    subscriptionActive: false,
    questionnaire: {
      allergies: "",
      dietaryRestrictions: [],
      physicalLimitations: [],
      fears: [],
      fitnessLevel: "",
      activityPreference: "",
      activityTypes: [],
      timePreference: [],
      dayPreference: [],
      medicalContraindications: "",
      additionalInfo: "",
    },
    subscription: {
      premiumLevel: "",
      city: "",
      street: "",
      house: "",
      apartment: "",
      phone: "",
      deliveryDate: "",
      deliveryTime: "",
      tariff: "",
      duration: "",
    },
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        eventDate: client.eventDate || "",
        questionnaireCompleted: client.questionnaireCompleted || false,
        subscriptionActive: client.subscriptionActive || false,
        questionnaire: client.questionnaire || {
          allergies: "",
          dietaryRestrictions: [],
          physicalLimitations: [],
          fears: [],
          fitnessLevel: "",
          activityPreference: "",
          activityTypes: [],
          timePreference: [],
          dayPreference: [],
          medicalContraindications: "",
          additionalInfo: "",
        },
        subscription: client.subscription || {
          premiumLevel: "",
          city: "",
          street: "",
          house: "",
          apartment: "",
          phone: "",
          deliveryDate: "",
          deliveryTime: "",
          tariff: "",
          duration: "",
        },
      });
    }
  }, [client]);

  if (!client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleMultiSelect = (key: keyof QuestionnaireData, value: string) => {
    const current = (formData.questionnaire?.[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setFormData({
      ...formData,
      questionnaire: {
        ...formData.questionnaire!,
        [key]: updated,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Редактирование клиента</h2>

        <div className="mb-6 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("main")}
              className={cn(
                "pb-3 px-2 text-sm font-medium transition-colors",
                activeTab === "main"
                  ? "text-[var(--color-golden)] border-b-2 border-[var(--color-golden)]"
                  : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]/70"
              )}
            >
              Основное
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("questionnaire")}
              className={cn(
                "pb-3 px-2 text-sm font-medium transition-colors",
                activeTab === "questionnaire"
                  ? "text-[var(--color-golden)] border-b-2 border-[var(--color-golden)]"
                  : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]/70"
              )}
            >
              Анкета
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("subscription")}
              className={cn(
                "pb-3 px-2 text-sm font-medium transition-colors",
                activeTab === "subscription"
                  ? "text-[var(--color-golden)] border-b-2 border-[var(--color-golden)]"
                  : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]/70"
              )}
            >
              Подписка
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "main" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Имя
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
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                  required
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
                  Дата мероприятия
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="questionnaireCompleted"
                    type="checkbox"
                    checked={formData.questionnaireCompleted}
                    onChange={(e) =>
                      setFormData({ ...formData, questionnaireCompleted: e.target.checked })
                    }
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <label htmlFor="questionnaireCompleted" className="text-sm font-medium cursor-pointer">
                    Анкета пройдена
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="subscriptionActive"
                    type="checkbox"
                    checked={formData.subscriptionActive}
                    onChange={(e) => setFormData({ ...formData, subscriptionActive: e.target.checked })}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <label htmlFor="subscriptionActive" className="text-sm font-medium cursor-pointer">
                    Подписка активна
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "questionnaire" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium mb-2">
                  Аллергии
                </label>
                <textarea
                  id="allergies"
                  value={formData.questionnaire?.allergies || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionnaire: { ...formData.questionnaire!, allergies: e.target.value },
                    })
                  }
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Пищевые ограничения</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {dietaryOptions.map((option) => {
                    const selected = formData.questionnaire?.dietaryRestrictions?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelect("dietaryRestrictions", option)}
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          selected
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          {selected && <Check className="w-4 h-4 text-[var(--color-golden)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Физические ограничения</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {physicalLimitationOptions.map((option) => {
                    const selected = formData.questionnaire?.physicalLimitations?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelect("physicalLimitations", option)}
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          selected
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          {selected && <Check className="w-4 h-4 text-[var(--color-golden)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Страхи и фобии</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fearOptions.map((option) => {
                    const selected = formData.questionnaire?.fears?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelect("fears", option)}
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          selected
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          {selected && <Check className="w-4 h-4 text-[var(--color-golden)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Уровень физической подготовки</label>
                <div className="space-y-2">
                  {fitnessLevelOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[var(--color-cream)]/20">
                      <input
                        type="radio"
                        name="fitnessLevel"
                        value={option}
                        checked={formData.questionnaire?.fitnessLevel === option}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            questionnaire: { ...formData.questionnaire!, fitnessLevel: e.target.value },
                          })
                        }
                        className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Предпочтение по формату</label>
                <div className="space-y-2">
                  {activityPreferenceOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[var(--color-cream)]/20">
                      <input
                        type="radio"
                        name="activityPreference"
                        value={option}
                        checked={formData.questionnaire?.activityPreference === option}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            questionnaire: { ...formData.questionnaire!, activityPreference: e.target.value },
                          })
                        }
                        className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Интересующие типы активностей</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activityTypeOptions.map((option) => {
                    const selected = formData.questionnaire?.activityTypes?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelect("activityTypes", option)}
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          selected
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          {selected && <Check className="w-4 h-4 text-[var(--color-golden)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Предпочтительное время</label>
                <div className="grid grid-cols-3 gap-2">
                  {timePreferenceOptions.map((option) => {
                    const selected = formData.questionnaire?.timePreference?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelect("timePreference", option)}
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          selected
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          {selected && <Check className="w-4 h-4 text-[var(--color-golden)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Предпочтительные дни</label>
                <div className="grid grid-cols-3 gap-2">
                  {dayPreferenceOptions.map((option) => {
                    const selected = formData.questionnaire?.dayPreference?.includes(option) || false;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelect("dayPreference", option)}
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          selected
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          {selected && <Check className="w-4 h-4 text-[var(--color-golden)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="medicalContraindications" className="block text-sm font-medium mb-2">
                  Медицинские противопоказания
                </label>
                <textarea
                  id="medicalContraindications"
                  value={formData.questionnaire?.medicalContraindications || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionnaire: { ...formData.questionnaire!, medicalContraindications: e.target.value },
                    })
                  }
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                  )}
                />
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
                  Дополнительные пожелания
                </label>
                <textarea
                  id="additionalInfo"
                  value={formData.questionnaire?.additionalInfo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionnaire: { ...formData.questionnaire!, additionalInfo: e.target.value },
                    })
                  }
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                  )}
                />
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tariff" className="block text-sm font-medium mb-2">
                    Тариф
                  </label>
                  <input
                    id="tariff"
                    type="text"
                    value={formData.subscription?.tariff || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription: { ...formData.subscription!, tariff: e.target.value },
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-2">
                    Длительность
                  </label>
                  <input
                    id="duration"
                    type="text"
                    value={formData.subscription?.duration || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription: { ...formData.subscription!, duration: e.target.value },
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Уровень премиальности</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {premiumLevelOptions.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          subscription: { ...formData.subscription!, premiumLevel: level.id },
                        })
                      }
                      className={cn(
                        "p-4 text-left border-2 transition-all duration-200",
                        formData.subscription?.premiumLevel === level.id
                          ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                          : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                      )}
                    >
                      <h4 className="font-bold mb-1">{level.name}</h4>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Телефон
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.subscription?.phone || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription: { ...formData.subscription!, phone: e.target.value },
                    })
                  }
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  Город
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.subscription?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription: { ...formData.subscription!, city: e.target.value },
                    })
                  }
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                />
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium mb-2">
                  Улица
                </label>
                <input
                  id="street"
                  type="text"
                  value={formData.subscription?.street || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription: { ...formData.subscription!, street: e.target.value },
                    })
                  }
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="house" className="block text-sm font-medium mb-2">
                    Дом
                  </label>
                  <input
                    id="house"
                    type="text"
                    value={formData.subscription?.house || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription: { ...formData.subscription!, house: e.target.value },
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium mb-2">
                    Квартира
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    value={formData.subscription?.apartment || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription: { ...formData.subscription!, apartment: e.target.value },
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium mb-2">
                    Дата доставки
                  </label>
                  <input
                    id="deliveryDate"
                    type="date"
                    value={formData.subscription?.deliveryDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription: { ...formData.subscription!, deliveryDate: e.target.value },
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Время доставки</label>
                  <div className="grid grid-cols-2 gap-2">
                    {deliveryTimeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subscription: { ...formData.subscription!, deliveryTime: slot.value },
                          })
                        }
                        className={cn(
                          "px-3 py-2 border-2 transition-all duration-200 text-left",
                          formData.subscription?.deliveryTime === slot.value
                            ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                            : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                        )}
                      >
                        <span className="text-xs">{slot.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            {onRevokeAdminRights && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onRevokeAdminRights) {
                    onRevokeAdminRights();
                  }
                }}
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                Отозвать админские права
              </Button>
            )}
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
                {deleteButtonText}
              </Button>
            )}
            {onBan && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onBan) {
                    onBan();
                  }
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2",
                  client?.banned
                    ? "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                )}
              >
                <Ban className="h-4 w-4" />
                {client?.banned ? "Разбанить" : "Забанить"}
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
