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
    <div className="space-y-8">
      <div className="flex flex-col gap-0 max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <User className="h-7 w-7 text-[var(--color-golden)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/70">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className={cn(
                "uppercase tracking-wider flex items-center gap-2 shrink-0",
                "border-[var(--color-golden)] text-[var(--color-golden)]",
                "hover:bg-[var(--color-golden)] hover:text-[var(--background)]"
              )}
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </div>

        {subscription ? (
          <div className="p-8 -mt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-[var(--color-golden)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{subscription.title}</h3>
                <p className="text-sm text-[var(--foreground)]/70">{subscription.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-2">Дата доставки</p>
                <p className="text-lg font-medium">{subscription.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-2">Время доставки</p>
                <p className="text-lg font-medium">{subscription.deliveryTime}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 -mt-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-[var(--color-golden)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Подписка отсутствует</h3>
                  <p className="text-sm text-[var(--foreground)]/70">
                    Оформите подписку в разделе "Подписка"
                  </p>
                </div>
              </div>
              <Link href="/cabinet/subscription">
                <Button
                  size="sm"
                  className={cn(
                    "uppercase tracking-wider shrink-0",
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

        <div className="p-8 -mt-6">
          {isQuestionnaireCompleted ? (
            <div className="flex items-center gap-4 p-6 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10">
              <div className="w-12 h-12 bg-[var(--color-golden)]/20 flex items-center justify-center shrink-0">
                <Check className="h-6 w-6 text-[var(--color-golden)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Анкетирование пройдено</h3>
                <p className="text-sm text-[var(--foreground)]/70">
                  Спасибо! Ваши ответы помогут нам организовать идеальное свидание
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQuestionnaireOpen(true)}
                className="uppercase tracking-wider"
              >
                Изменить
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsQuestionnaireOpen(true)}
              className="w-full p-6 bg-[var(--color-golden)] hover:opacity-90 transition-opacity text-left"
            >
              <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-[var(--background)] shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-[var(--background)]">Пройти анкетирование</h3>
                  <p className="text-sm text-[var(--background)]/80">
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

