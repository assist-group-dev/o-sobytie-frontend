"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { User, Package, LogOut, Mail, FileText, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { QuestionnaireModal } from "@/app/(cabinet)/components/QuestionnaireModal";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { useAppStore } from "@/stores/useAppStore";

export default function CabinetPage() {
  const router = useRouter();
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { subscription, userData, fetchProfile } = useCabinetStore();
  const { logout } = useAppStore();

  const { isFetchingProfile, fetchProfileError } = useCabinetStore();

  useEffect(() => {
    if (!userData && !isFetchingProfile && !fetchProfileError) {
      fetchProfile().catch(() => {
        router.push("/");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      useCabinetStore.getState().setUserData(null);
      setIsLogoutModalOpen(false);
      router.push("/");
    }
  };

  const handleQuestionnaireComplete = () => {
    setIsQuestionnaireCompleted(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-0 max-w-3xl">
        <div className="p-4 sm:p-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[var(--color-golden)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 truncate">
                  {userData?.name ?? "Загрузка..."}
                </h2>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[var(--foreground)]/70">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{userData?.email ?? "Загрузка..."}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutClick}
              className={cn(
                "uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shrink-0",
                "border-[var(--color-golden)] text-[var(--color-golden)]",
                "hover:bg-[var(--color-golden)] hover:text-[var(--background)]",
                "px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
              )}
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>

        {subscription ? (
          <div className="p-4 sm:p-8 -mt-4 sm:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">{subscription.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/70">{subscription.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-[var(--color-cream)]/70 dark:border-[var(--color-cream)]/20">
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
          <div className="p-4 sm:p-8 -mt-4 sm:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
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

        <div className="p-4 sm:p-8 -mt-4 sm:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
          {isQuestionnaireCompleted ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-[var(--color-cream)]/60 dark:bg-[var(--color-cream)]/10">
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

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold uppercase mb-4">Подтверждение выхода</h2>
          <p className="text-sm text-[var(--foreground)]/70 mb-6">
            Вы уверены, что хотите выйти из аккаунта?
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 uppercase tracking-wider"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              className="flex-1 uppercase tracking-wider"
              onClick={handleLogoutConfirm}
            >
              Выйти
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

