"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { Check, Ban } from "lucide-react";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";
import type {
  SubscriptionFromApi,
  SubscriptionPatchPayload,
  ClientSaveData,
} from "@/app/(admin)/admin/clients/page";

interface QuestionnaireData {
  allergies: string;
  dietaryRestrictions: string[];
  dietaryRestrictionsOther?: string;
  physicalLimitations: string[];
  physicalLimitationsOther?: string;
  fears: string[];
  fearsOther?: string;
  timePreference: string[];
  dayPreference: string[];
  additionalInfo: string;
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
  subscription?: SubscriptionFromApi | null;
}

interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onSave: (data: ClientSaveData) => void;
  onBan?: () => void;
  onDelete?: () => void;
  onRevokeAdminRights?: () => void;
  deleteButtonText?: string;
}

interface DurationOption {
  _id: string;
  name: string;
  months: number;
}

interface PremiumLevelOption {
  _id: string;
  name: string;
}

const dietaryOptions = ["Без ограничений", "Вегетарианство", "Веганство", "Халяль", "Без глютена", "Без лактозы", "Другое"];
const physicalLimitationOptions = ["Без ограничений", "Проблемы с суставами", "Проблемы со спиной", "Ограниченная подвижность", "Другое"];
const fearOptions = ["Без ограничений", "Высота", "Вода", "Закрытые пространства", "Темнота", "Толпа", "Другое"];
const timePreferenceOptions = ["Утро", "День", "Вечер"];
const dayPreferenceOptions = ["Будни", "Выходные", "Любые дни"];
const SUBSCRIPTION_STATUSES = [
  { value: "active", label: "Активна" },
  { value: "grace", label: "Льготный период" },
  { value: "expired", label: "Истекла" },
  { value: "cancelled", label: "Отменена" },
] as const;

function subscriptionToEditPayload(s: SubscriptionFromApi): SubscriptionPatchPayload {
  return {
    id: s.id,
    status: s.status,
    durationId: s.duration?.id ?? "",
    premiumLevelId: s.premiumLevel?.id ?? "",
    city: s.city ?? "",
    street: s.street ?? "",
    house: s.house ?? "",
    apartment: s.apartment ?? "",
    phone: s.phone ?? "",
    deliveryDate: s.deliveryDate ? String(s.deliveryDate).slice(0, 10) : "",
    deliveryTime: s.deliveryTime ?? "",
  };
}

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
      dietaryRestrictionsOther: "",
      physicalLimitations: [],
      physicalLimitationsOther: "",
      fears: [],
      fearsOther: "",
      timePreference: [],
      dayPreference: [],
      additionalInfo: "",
    },
    subscription: null,
  });
  const [subscriptionEdit, setSubscriptionEdit] = useState<SubscriptionPatchPayload | null>(null);
  const [durations, setDurations] = useState<DurationOption[]>([]);
  const [premiumLevels, setPremiumLevels] = useState<PremiumLevelOption[]>([]);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name ?? "",
        email: client.email ?? "",
        eventDate: client.eventDate ?? "",
        questionnaireCompleted: client.questionnaireCompleted ?? false,
        subscriptionActive: client.subscriptionActive ?? false,
        questionnaire: client.questionnaire ?? {
          allergies: "",
          dietaryRestrictions: [],
          dietaryRestrictionsOther: "",
          physicalLimitations: [],
          physicalLimitationsOther: "",
          fears: [],
          fearsOther: "",
          timePreference: [],
          dayPreference: [],
          additionalInfo: "",
        },
        subscription: client.subscription ?? null,
      });
      setSubscriptionEdit(
        client.subscription ? subscriptionToEditPayload(client.subscription) : null
      );
    }
  }, [client]);

  const loadTariffOptions = useCallback(async () => {
    try {
      const [durRes, plRes] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/admin/tariffs/durations`),
        fetchWithAuth(`${API_BASE_URL}/admin/tariffs/premium-levels`),
      ]);
      if (durRes.ok) {
        const data = (await durRes.json()) as DurationOption[];
        setDurations(Array.isArray(data) ? data : []);
      }
      if (plRes.ok) {
        const data = (await plRes.json()) as PremiumLevelOption[];
        setPremiumLevels(Array.isArray(data) ? data : []);
      }
    } catch {
      setDurations([]);
      setPremiumLevels([]);
    }
  }, []);

  useEffect(() => {
    if (isOpen && client?.subscription) {
      loadTariffOptions();
    }
  }, [isOpen, client?.subscription, loadTariffOptions]);

  if (!client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      subscription: subscriptionEdit ?? undefined,
    });
    onClose();
  };

  const handleMultiSelect = (key: keyof QuestionnaireData, value: string) => {
    const current = (formData.questionnaire?.[key] as string[]) || [];
    
    if (key === "dietaryRestrictions") {
      if (value === "Без ограничений") {
        return setFormData({
          ...formData,
          questionnaire: {
            ...formData.questionnaire!,
            [key]: current.includes("Без ограничений") ? [] : ["Без ограничений"],
            dietaryRestrictionsOther: "",
          },
        });
      }
      const withoutNoRestrictions = current.filter((item) => item !== "Без ограничений");
      const updated = withoutNoRestrictions.includes(value)
        ? withoutNoRestrictions.filter((item) => item !== value)
        : [...withoutNoRestrictions, value];
      return setFormData({
        ...formData,
        questionnaire: {
          ...formData.questionnaire!,
          [key]: updated,
          dietaryRestrictionsOther: updated.includes("Другое") ? formData.questionnaire?.dietaryRestrictionsOther || "" : "",
        },
      });
    }
    
    if (key === "physicalLimitations") {
      if (value === "Без ограничений") {
        return setFormData({
          ...formData,
          questionnaire: {
            ...formData.questionnaire!,
            [key]: current.includes("Без ограничений") ? [] : ["Без ограничений"],
            physicalLimitationsOther: "",
          },
        });
      }
      const withoutNoRestrictions = current.filter((item) => item !== "Без ограничений");
      const updated = withoutNoRestrictions.includes(value)
        ? withoutNoRestrictions.filter((item) => item !== value)
        : [...withoutNoRestrictions, value];
      return setFormData({
        ...formData,
        questionnaire: {
          ...formData.questionnaire!,
          [key]: updated,
          physicalLimitationsOther: updated.includes("Другое") ? formData.questionnaire?.physicalLimitationsOther || "" : "",
        },
      });
    }
    
    if (key === "fears") {
      if (value === "Без ограничений") {
        return setFormData({
          ...formData,
          questionnaire: {
            ...formData.questionnaire!,
            [key]: current.includes("Без ограничений") ? [] : ["Без ограничений"],
            fearsOther: "",
          },
        });
      }
      const withoutNoRestrictions = current.filter((item) => item !== "Без ограничений");
      const updated = withoutNoRestrictions.includes(value)
        ? withoutNoRestrictions.filter((item) => item !== value)
        : [...withoutNoRestrictions, value];
      return setFormData({
        ...formData,
        questionnaire: {
          ...formData.questionnaire!,
          [key]: updated,
          fearsOther: updated.includes("Другое") ? formData.questionnaire?.fearsOther || "" : "",
        },
      });
    }
    
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
                      <div key={option}>
                        <button
                          type="button"
                          onClick={() => handleMultiSelect("dietaryRestrictions", option)}
                          className={cn(
                            "w-full px-3 py-2 border-2 transition-all duration-200 text-left",
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
                        {option === "Другое" && selected && (
                          <div className="mt-2">
                            <textarea
                              value={formData.questionnaire?.dietaryRestrictionsOther || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  questionnaire: {
                                    ...formData.questionnaire!,
                                    dietaryRestrictionsOther: e.target.value,
                                  },
                                })
                              }
                              placeholder="Укажите ваши пищевые ограничения"
                              rows={3}
                              className={cn(
                                "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                                "bg-[var(--background)] text-[var(--foreground)]",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                              )}
                            />
                          </div>
                        )}
                      </div>
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
                      <div key={option}>
                        <button
                          type="button"
                          onClick={() => handleMultiSelect("physicalLimitations", option)}
                          className={cn(
                            "w-full px-3 py-2 border-2 transition-all duration-200 text-left",
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
                        {option === "Другое" && selected && (
                          <div className="mt-2">
                            <textarea
                              value={formData.questionnaire?.physicalLimitationsOther || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  questionnaire: {
                                    ...formData.questionnaire!,
                                    physicalLimitationsOther: e.target.value,
                                  },
                                })
                              }
                              placeholder="Укажите ваши физические ограничения"
                              rows={3}
                              className={cn(
                                "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                                "bg-[var(--background)] text-[var(--foreground)]",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                              )}
                            />
                          </div>
                        )}
                      </div>
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
                      <div key={option}>
                        <button
                          type="button"
                          onClick={() => handleMultiSelect("fears", option)}
                          className={cn(
                            "w-full px-3 py-2 border-2 transition-all duration-200 text-left",
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
                        {option === "Другое" && selected && (
                          <div className="mt-2">
                            <textarea
                              value={formData.questionnaire?.fearsOther || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  questionnaire: {
                                    ...formData.questionnaire!,
                                    fearsOther: e.target.value,
                                  },
                                })
                              }
                              placeholder="Укажите ваши страхи и фобии"
                              rows={3}
                              className={cn(
                                "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                                "bg-[var(--background)] text-[var(--foreground)]",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                              )}
                            />
                          </div>
                        )}
                      </div>
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
              {subscriptionEdit ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Дата оформления подписки</label>
                      <p className="px-4 py-2 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 rounded border border-[var(--color-cream)]/50 text-[var(--foreground)]">
                        {formData.subscription?.startDate
                          ? new Date(formData.subscription.startDate).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Дата окончания подписки</label>
                      <p className="px-4 py-2 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 rounded border border-[var(--color-cream)]/50 text-[var(--foreground)]">
                        {formData.subscription?.nextPaymentDate
                          ? new Date(formData.subscription.nextPaymentDate).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sub-status" className="block text-sm font-medium mb-2">
                        Статус
                      </label>
                      <select
                        id="sub-status"
                        value={subscriptionEdit.status}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, status: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      >
                        {SUBSCRIPTION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="sub-duration" className="block text-sm font-medium mb-2">
                        Тариф (срок)
                      </label>
                      <select
                        id="sub-duration"
                        value={subscriptionEdit.durationId}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, durationId: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
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
                      <label htmlFor="sub-premium" className="block text-sm font-medium mb-2">
                        Уровень премиальности
                      </label>
                      <select
                        id="sub-premium"
                        value={subscriptionEdit.premiumLevelId}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, premiumLevelId: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      >
                        <option value="">—</option>
                        {premiumLevels.map((pl) => (
                          <option key={pl._id} value={pl._id}>
                            {pl.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="sub-phone" className="block text-sm font-medium mb-2">
                        Телефон
                      </label>
                      <input
                        id="sub-phone"
                        type="text"
                        value={subscriptionEdit.phone}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, phone: e.target.value })
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
                      <label htmlFor="sub-city" className="block text-sm font-medium mb-2">
                        Город
                      </label>
                      <input
                        id="sub-city"
                        type="text"
                        value={subscriptionEdit.city}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, city: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor="sub-street" className="block text-sm font-medium mb-2">
                        Улица
                      </label>
                      <input
                        id="sub-street"
                        type="text"
                        value={subscriptionEdit.street}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, street: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor="sub-house" className="block text-sm font-medium mb-2">
                        Дом
                      </label>
                      <input
                        id="sub-house"
                        type="text"
                        value={subscriptionEdit.house}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, house: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor="sub-apartment" className="block text-sm font-medium mb-2">
                        Квартира
                      </label>
                      <input
                        id="sub-apartment"
                        type="text"
                        value={subscriptionEdit.apartment}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, apartment: e.target.value })
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
                      <label htmlFor="sub-deliveryDate" className="block text-sm font-medium mb-2">
                        Дата доставки
                      </label>
                      <input
                        id="sub-deliveryDate"
                        type="date"
                        value={subscriptionEdit.deliveryDate}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, deliveryDate: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor="sub-deliveryTime" className="block text-sm font-medium mb-2">
                        Время доставки
                      </label>
                      <input
                        id="sub-deliveryTime"
                        type="text"
                        value={subscriptionEdit.deliveryTime}
                        onChange={(e) =>
                          setSubscriptionEdit({ ...subscriptionEdit, deliveryTime: e.target.value })
                        }
                        placeholder="Напр. 09:00–12:00"
                        className={cn(
                          "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                          "bg-[var(--background)] text-[var(--foreground)]",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                        )}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-[var(--foreground)]/60">У клиента нет активной подписки.</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            {onRevokeAdminRights && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onRevokeAdminRights) {
                    onRevokeAdminRights();
                  }
                }}
                className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
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
                className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                  "flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0 flex items-center justify-center gap-2",
                  client?.banned
                    ? "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                )}
              >
                <Ban className="h-4 w-4" />
                {client?.banned ? "Разбанить" : "Забанить"}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0">
              Отмена
            </Button>
            <Button type="submit" className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
