"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { cn } from "@/utils/cn";

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function QuestionnaireModal({ isOpen, onClose, onComplete }: QuestionnaireModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    allergies: "",
    dietaryRestrictions: [] as string[],
    dietaryRestrictionsOther: "",
    physicalLimitations: [] as string[],
    physicalLimitationsOther: "",
    fears: [] as string[],
    fearsOther: "",
    fitnessLevel: "",
    activityPreference: "",
    activityTypes: [] as string[],
    medicalContraindications: "",
    timePreference: [] as string[],
    dayPreference: [] as string[],
    additionalInfo: "",
  });

  const dietaryOptions = ["Без ограничений", "Вегетарианство", "Веганство", "Халяль", "Без глютена", "Без лактозы", "Другое"];
  const physicalLimitationOptions = ["Проблемы с суставами", "Проблемы со спиной", "Ограниченная подвижность", "Другое"];
  const fearOptions = ["Высота", "Вода", "Закрытые пространства", "Темнота", "Толпа", "Другое"];
  const timePreferenceOptions = ["Утро", "День", "Вечер"];
  const dayPreferenceOptions = ["Будни", "Выходные", "Любые дни"];

  const steps = [
    {
      title: "Аллергии и пищевые ограничения",
      fields: [
        {
          label: "Аллергии",
          type: "textarea",
          key: "allergies",
          placeholder: "Укажите все известные аллергии (если есть)",
        },
        {
          label: "Пищевые ограничения",
          type: "multiselect",
          key: "dietaryRestrictions",
          options: dietaryOptions,
        },
      ],
    },
    {
      title: "Физические ограничения",
      fields: [
        {
          label: "Физические ограничения",
          type: "multiselect",
          key: "physicalLimitations",
          options: physicalLimitationOptions,
        },
      ],
    },
    {
      title: "Страхи и фобии",
      fields: [
        {
          label: "Страхи и фобии",
          type: "multiselect",
          key: "fears",
          options: fearOptions,
        },
      ],
    },
    {
      title: "Время и дни",
      fields: [
        {
          label: "Предпочтительное время",
          type: "multiselect",
          key: "timePreference",
          options: timePreferenceOptions,
        },
        {
          label: "Предпочтительные дни",
          type: "multiselect",
          key: "dayPreference",
          options: dayPreferenceOptions,
        },
      ],
    },
    {
      title: "Дополнительная информация",
      fields: [
        {
          label: "Дополнительные пожелания",
          type: "textarea",
          key: "additionalInfo",
          placeholder: "Любая дополнительная информация, которая поможет нам лучше организовать ваше свидание",
        },
      ],
    },
  ];

  const handleFieldChange = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (key: string, value: string) => {
    setFormData((prev) => {
      const current = (prev[key as keyof typeof prev] as string[]) || [];
      
      if (key === "dietaryRestrictions") {
        if (value === "Без ограничений") {
          return { ...prev, [key]: current.includes("Без ограничений") ? [] : ["Без ограничений"], dietaryRestrictionsOther: "" };
        }
        const withoutNoRestrictions = current.filter((item) => item !== "Без ограничений");
        const updated = withoutNoRestrictions.includes(value)
          ? withoutNoRestrictions.filter((item) => item !== value)
          : [...withoutNoRestrictions, value];
        return { ...prev, [key]: updated, dietaryRestrictionsOther: updated.includes("Другое") ? prev.dietaryRestrictionsOther : "" };
      }
      
      if (key === "physicalLimitations") {
        const updated = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [key]: updated, physicalLimitationsOther: updated.includes("Другое") ? prev.physicalLimitationsOther : "" };
      }
      
      if (key === "fears") {
        const updated = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [key]: updated, fearsOther: updated.includes("Другое") ? prev.fearsOther : "" };
      }
      
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Questionnaire submitted:", formData);
    onComplete();
    onClose();
    setCurrentStep(0);
    setFormData({
      allergies: "",
      dietaryRestrictions: [],
      dietaryRestrictionsOther: "",
      physicalLimitations: [],
      physicalLimitationsOther: "",
      fears: [],
      fearsOther: "",
      fitnessLevel: "",
      activityPreference: "",
      activityTypes: [],
      medicalContraindications: "",
      timePreference: [],
      dayPreference: [],
      additionalInfo: "",
    });
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-3xl w-full mx-2 sm:mx-4">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">{currentStepData.title}</h2>
          </div>
          <div className="mb-2">
            <div className="h-2 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 overflow-hidden">
              <div
                className="h-full bg-[var(--color-golden)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
            Шаг {currentStep + 1} из {steps.length}
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="space-y-4 sm:space-y-6">
            {currentStepData.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                  {field.label}
                </label>
                {field.type === "textarea" && (
                  <textarea
                    value={(formData[field.key as keyof typeof formData] as string) || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={cn(
                      "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                      "resize-none"
                    )}
                  />
                )}
                {field.type === "radio" && (
                  <div className="space-y-2">
                    {field.options?.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2.5 sm:p-3 hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10 transition-colors"
                      >
                        <input
                          type="radio"
                          name={field.key}
                          value={option}
                          checked={(formData[field.key as keyof typeof formData] as string) === option}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                        />
                        <span className="text-xs sm:text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "multiselect" && (
                  <div className="space-y-2">
                    {field.options?.map((option) => {
                      const selected = (formData[field.key as keyof typeof formData] as string[])?.includes(option) || false;
                      return (
                        <div key={option}>
                          <button
                            type="button"
                            onClick={() => handleMultiSelect(field.key, option)}
                            className={cn(
                              "w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 border-2 transition-all duration-200",
                              selected
                                ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                                : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm">{option}</span>
                              {selected && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-golden)]" />}
                            </div>
                          </button>
                          {field.key === "dietaryRestrictions" && option === "Другое" && selected && (
                            <div className="mt-2">
                              <textarea
                                value={formData.dietaryRestrictionsOther}
                                onChange={(e) => setFormData((prev) => ({ ...prev, dietaryRestrictionsOther: e.target.value }))}
                                placeholder="Укажите ваши пищевые ограничения"
                                rows={3}
                                className={cn(
                                  "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                                  "bg-[var(--background)] text-[var(--foreground)]",
                                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                                  "resize-none"
                                )}
                              />
                            </div>
                          )}
                          {field.key === "physicalLimitations" && option === "Другое" && selected && (
                            <div className="mt-2">
                              <textarea
                                value={formData.physicalLimitationsOther}
                                onChange={(e) => setFormData((prev) => ({ ...prev, physicalLimitationsOther: e.target.value }))}
                                placeholder="Укажите ваши физические ограничения"
                                rows={3}
                                className={cn(
                                  "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                                  "bg-[var(--background)] text-[var(--foreground)]",
                                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                                  "resize-none"
                                )}
                              />
                            </div>
                          )}
                          {field.key === "fears" && option === "Другое" && selected && (
                            <div className="mt-2">
                              <textarea
                                value={formData.fearsOther}
                                onChange={(e) => setFormData((prev) => ({ ...prev, fearsOther: e.target.value }))}
                                placeholder="Укажите ваши страхи и фобии"
                                rows={3}
                                className={cn(
                                  "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                                  "bg-[var(--background)] text-[var(--foreground)]",
                                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                                  "resize-none"
                                )}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="uppercase tracking-wider w-full sm:w-auto order-2 sm:order-1"
            >
              Назад
            </Button>
          )}
          <div className="flex-1 hidden sm:block" />
          {isLastStep ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              className="uppercase tracking-wider w-full sm:w-auto order-1 sm:order-2"
            >
              Завершить анкетирование
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              className="uppercase tracking-wider w-full sm:w-auto order-1 sm:order-2"
            >
              Далее
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

