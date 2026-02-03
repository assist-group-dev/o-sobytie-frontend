"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { User, Package, LogOut, Mail, FileText, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { QuestionnaireModal } from "@/app/(cabinet)/components/QuestionnaireModal";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";

export default function CabinetPage() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const { subscription } = useCabinetStore();

  const user = {
    name: "Иван Иванов",
    email: "ivan@example.com",
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleQuestionnaireComplete = () => {
    setIsQuestionnaireCompleted(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-0 max-w-2xl">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-golden)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold mb-1 truncate">{user.name}</h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--foreground)]/70">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className={cn(
                "uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto",
                "border-[var(--color-golden)] text-[var(--color-golden)]",
                "hover:bg-[var(--color-golden)] hover:text-[var(--background)]"
              )}
            >
              <LogOut className="w-4 h-4" />
              <span className="sm:inline">Выйти</span>
            </Button>
          </div>
        </div>

        {subscription ? (
          <div className="p-4 sm:p-8 -mt-4 sm:-mt-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">{subscription.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/70">{subscription.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <div>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mb-1 sm:mb-2">Дата доставки</p>
                <p className="text-base sm:text-lg font-medium">{subscription.deliveryDate}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mb-1 sm:mb-2">Время доставки</p>
                <p className="text-base sm:text-lg font-medium">{subscription.deliveryTime}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-8 -mt-4 sm:-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Подписка отсутствует</h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
                    Оформите подписку в разделе "Подписка"
                  </p>
                </div>
              </div>
              <Link href="/cabinet/subscription" className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className={cn(
                    "uppercase tracking-wider shrink-0 w-full sm:w-auto",
                    "bg-[var(--color-golden)] text-[var(--background)]",
                    "hover:opacity-90"
                  )}
                >
                  Оформить
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-8 -mt-4 sm:-mt-6">
          {isQuestionnaireCompleted ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-golden)]/20 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold mb-1">Анкетирование пройдено</h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
                  Спасибо! Ваши ответы помогут нам организовать идеальное свидание
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQuestionnaireOpen(true)}
                className="uppercase tracking-wider w-full sm:w-auto"
              >
                Изменить
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsQuestionnaireOpen(true)}
              className="w-full p-4 sm:p-6 bg-[var(--color-golden)] hover:opacity-90 transition-opacity text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--background)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold mb-1 text-[var(--background)]">Пройти анкетирование</h3>
                  <p className="text-xs sm:text-sm text-[var(--background)]/80">
                    Помогите нам узнать ваши предпочтения для идеального свидания
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onComplete={handleQuestionnaireComplete}
      />
    </div>
  );
}

