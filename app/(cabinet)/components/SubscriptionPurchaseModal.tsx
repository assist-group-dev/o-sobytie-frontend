"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface Tariff {
  id: string;
  title: string;
  price: string;
}

interface SubscriptionPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: Tariff;
  onSuccess?: () => void;
}

export interface SubscriptionFormData {
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
}

const DELIVERY_TIME_SLOTS = [
  { id: "morning", label: "09:00 - 12:00", value: "09:00-12:00" },
  { id: "afternoon", label: "12:00 - 15:00", value: "12:00-15:00" },
  { id: "evening", label: "15:00 - 18:00", value: "15:00-18:00" },
  { id: "late", label: "18:00 - 21:00", value: "18:00-21:00" },
];

export function SubscriptionPurchaseModal({
  isOpen,
  onClose,
  tariff,
  onSuccess,
}: SubscriptionPurchaseModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    city: "",
    street: "",
    house: "",
    apartment: "",
    phone: "",
    deliveryDate: "",
    deliveryTime: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = [
    {
      title: "Адрес доставки",
      description: "Укажите адрес, куда будет доставлена коробка",
    },
    {
      title: "Контактные данные",
      description: "Укажите телефон для связи",
    },
    {
      title: "Дата и время доставки",
      description: "Выберите удобную дату и время",
    },
  ];

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

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/subscriptions`, {
        method: "POST",
        body: JSON.stringify({
          durationId: tariff.id,
          city: formData.city.trim(),
          street: formData.street.trim(),
          house: formData.house.trim(),
          apartment: (formData.apartment ?? "").trim(),
          phone: formData.phone.trim(),
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
        }),
      });
      if (!response.ok) {
        const err = (await response.json()) as { message?: string };
        throw new Error(err.message ?? "Ошибка оформления подписки");
      }
      onSuccess?.();
      onClose();
      setCurrentStep(0);
      setFormData({
        city: "",
        street: "",
        house: "",
        apartment: "",
        phone: "",
        deliveryDate: "",
        deliveryTime: "",
      });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Ошибка оформления подписки");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.city.trim() !== "" &&
          formData.street.trim() !== "" &&
          formData.house.trim() !== ""
        );
      case 1:
        return formData.phone.trim() !== "";
      case 2:
        return formData.deliveryDate !== "" && formData.deliveryTime !== "";
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateInputValue, setDateInputValue] = useState("");
  const [isDateInputFocused, setIsDateInputFocused] = useState(false);

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayDate;
  };

  const isDateSelected = (day: number) => {
    if (!formData.deliveryDate) return false;
    const selectedDate = new Date(formData.deliveryDate);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getFullYear() === calendarYear
    );
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const dateString = date.toISOString().split("T")[0];
    setFormData({ ...formData, deliveryDate: dateString });
    setDateInputValue(
      date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, ".")
    );
    setIsCalendarOpen(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateInput = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length === 0) return "";
    
    let formatted = digits;
    if (digits.length > 2) {
      formatted = digits.slice(0, 2) + "." + digits.slice(2);
    }
    if (digits.length > 4) {
      formatted = digits.slice(0, 2) + "." + digits.slice(2, 4) + "." + digits.slice(4, 8);
    }
    
    return formatted;
  };

  const parseDateInput = (input: string) => {
    const cleaned = input.replace(/\s/g, "");
    const patterns = [
      /(\d{1,2})[.\s/-](\d{1,2})[.\s/-](\d{4})/,
      /(\d{1,2})[.\s/-](\d{1,2})[.\s/-](\d{2})/,
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        let [, day, month, year] = match;
        if (year.length === 2) {
          year = "20" + year;
        }
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime()) && date.getDate() === parseInt(day)) {
          return date.toISOString().split("T")[0];
        }
      }
    }
    return null;
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !disabled && handleDateSelect(day)}
          disabled={disabled}
          className={cn(
            "px-1.5 py-1.5 text-xs font-medium transition-all duration-200",
            disabled
              ? "text-[var(--foreground)]/20 cursor-not-allowed"
              : selected
              ? "bg-[var(--color-golden)] text-[var(--background)]"
              : "text-[var(--foreground)] hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-3xl w-full mx-2 sm:mx-4">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase mb-1">
              Оформление подписки
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
              <span className="whitespace-nowrap">{tariff.title}</span> • {tariff.price}
            </p>
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
          <h3 className="text-lg sm:text-xl font-bold mb-2">{steps[currentStep].title}</h3>
          <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-4 sm:mb-6">
            {steps[currentStep].description}
          </p>

          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-medium mb-2">
                  Город
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  placeholder={focusedField === "city" ? "" : "Москва"}
                  className={cn(
                    "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                  required
                />
              </div>
              <div>
                <label htmlFor="street" className="block text-xs sm:text-sm font-medium mb-2">
                  Улица
                </label>
                <input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  onFocus={() => setFocusedField("street")}
                  onBlur={() => setFocusedField(null)}
                  placeholder={focusedField === "street" ? "" : "Ленина"}
                  className={cn(
                    "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="house" className="block text-xs sm:text-sm font-medium mb-2">
                    Дом
                  </label>
                  <input
                    id="house"
                    type="text"
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    onFocus={() => setFocusedField("house")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={focusedField === "house" ? "" : "10"}
                    className={cn(
                      "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="apartment" className="block text-xs sm:text-sm font-medium mb-2">
                    Квартира
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    onFocus={() => setFocusedField("apartment")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={focusedField === "apartment" ? "" : "25"}
                    className={cn(
                      "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-medium mb-2">
                Телефон
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
                className={cn(
                  "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Точная дата доставки
                </label>
                <div className="relative w-full sm:w-fit sm:max-w-xs">
                  <input
                    type="text"
                    value={
                      isDateInputFocused
                        ? dateInputValue
                        : formData.deliveryDate
                        ? formatDateForDisplay(formData.deliveryDate)
                        : ""
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const formatted = formatDateInput(inputValue);
                      setDateInputValue(formatted);
                      const parsedDate = parseDateInput(formatted);
                      if (parsedDate) {
                        setFormData({ ...formData, deliveryDate: parsedDate });
                      } else if (formatted === "") {
                        setFormData({ ...formData, deliveryDate: "" });
                      }
                    }}
                    onFocus={() => {
                      setIsDateInputFocused(true);
                      setIsCalendarOpen(false);
                      if (formData.deliveryDate) {
                        const date = new Date(formData.deliveryDate);
                        setDateInputValue(
                          date.toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).replace(/\//g, ".")
                        );
                      }
                    }}
                    onBlur={() => {
                      setIsDateInputFocused(false);
                      if (dateInputValue && !formData.deliveryDate) {
                        const parsedDate = parseDateInput(dateInputValue);
                        if (parsedDate) {
                          setFormData({ ...formData, deliveryDate: parsedDate });
                        } else {
                          setDateInputValue("");
                        }
                      }
                    }}
                    onClick={() => {
                      if (!isDateInputFocused) {
                        setIsCalendarOpen(!isCalendarOpen);
                      }
                    }}
                    placeholder="ДД.ММ.ГГГГ"
                    className={cn(
                      "w-full px-3 sm:px-4 py-2 pr-8 sm:pr-10 text-sm sm:text-base border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
                {isCalendarOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCalendarOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-20 w-full sm:w-72 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 bg-[var(--background)] shadow-lg">
                      <div className="p-2 sm:p-3">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10 transition-colors"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <h4 className="text-xs sm:text-sm font-bold">
                            {monthNames[calendarMonth]} {calendarYear}
                          </h4>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10 transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                          {weekDays.map((day) => (
                            <div
                              key={day}
                              className="text-center text-xs font-medium text-[var(--foreground)]/60 py-1"
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {renderCalendarDays()}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                  Примерное время доставки
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {DELIVERY_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryTime: slot.value })}
                      className={cn(
                        "px-3 sm:px-4 py-2.5 sm:py-3 border-2 transition-all duration-200 text-left",
                        formData.deliveryTime === slot.value
                          ? "border-[var(--color-golden)] bg-[var(--color-golden)]/10"
                          : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                      )}
                    >
                      <span className="text-xs sm:text-sm font-medium">{slot.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{submitError}</p>
        )}
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
              disabled={!isStepValid() || isSubmitting}
              className="uppercase tracking-wider w-full sm:w-auto order-1 sm:order-2"
            >
              {isSubmitting ? "Оформление…" : "Оформить подписку"}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="uppercase tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              Далее
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

