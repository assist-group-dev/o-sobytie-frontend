"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { User, Package, LogOut, Mail, FileText } from "lucide-react";
import { cn } from "@/utils/cn";
import { QuestionnaireModal } from "@/app/(cabinet)/components/QuestionnaireModal";
import { SubscriptionModal } from "@/app/(cabinet)/components/SubscriptionModal";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { useToastStore } from "@/app/(cabinet)/stores/useToastStore";
import { useAppStore } from "@/stores/useAppStore";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

export default function CabinetPage() {
  const router = useRouter();
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const { subscription, userData, fetchProfile, setUserData } = useCabinetStore();
  const { logout } = useAppStore();

  const { isFetchingProfile, fetchProfileError } = useCabinetStore();
  const questionnaireCompleted = userData?.questionnaireCompleted ?? false;

  useEffect(() => {
    if (!userData && !isFetchingProfile && !fetchProfileError) {
      fetchProfile().catch((error) => {
        console.error("Failed to fetch profile:", error);
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
          router.push("/");
        }
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
      await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      logout();
      const cabinet = useCabinetStore.getState();
      cabinet.setUserData(null);
      cabinet.setSubscription(null);
      setIsLogoutModalOpen(false);
      router.push("/");
    }
  };

  const { addToast } = useToastStore();

  const handleQuestionnaireComplete = () => {
    if (userData) {
      setUserData({ ...userData, questionnaireCompleted: true });
    }
    setIsQuestionnaireOpen(false);
    addToast({
      type: "success",
      message: "Анкетирование успешно завершено! Теперь вы можете оформить подписку.",
      duration: 4000,
    });
    setIsSubscriptionModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-0 max-w-3xl">
        <div className="p-3 sm:p-4 lg:p-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
          <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 truncate">
                  {userData?.name ?? "Загрузка..."}
                </h2>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--foreground)]/70">
                  <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="truncate">{userData?.email ?? "Загрузка..."}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutClick}
              className={cn(
                "uppercase tracking-wider flex items-center justify-center shrink-0",
                "border-[var(--color-golden)] text-[var(--color-golden)]",
                "hover:bg-[var(--color-golden)] hover:text-[var(--background)]",
                "px-2 py-1.5 sm:px-3 sm:py-1.5",
                "min-w-[36px] sm:min-w-auto"
              )}
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1.5 sm:ml-2">Выйти</span>
            </Button>
          </div>
        </div>

        {subscription ? (
          <div className="p-3 sm:p-4 lg:p-6 -mt-2 sm:-mt-4 lg:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 truncate">
                  Ваша подписка
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
                  {subscription.duration.name} • Следующее списание:{" "}
                  {new Date(subscription.nextPaymentDate).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 lg:pt-6 border-t border-[var(--color-cream)]/70 dark:border-[var(--color-cream)]/20">
              <div>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mb-1 sm:mb-2">
                  Адрес доставки
                </p>
                <p className="text-sm sm:text-base font-medium">
                  {[subscription.city, subscription.street, `д. ${subscription.house}`, subscription.apartment ? `кв. ${subscription.apartment}` : null]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div className="flex items-start justify-between gap-4 sm:gap-6">
                <div>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mb-1 sm:mb-2">
                    Дата доставки
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-medium">
                    {new Date(subscription.deliveryDate).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mb-1 sm:mb-2">
                    Время доставки
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-medium">
                    {subscription.deliveryTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4 lg:p-6 -mt-2 sm:-mt-4 lg:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-golden)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1">Подписка отсутствует</h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
                    Оформите подписку, нажав на кнопку "Оформить"
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setIsSubscriptionModalOpen(true)}
                className={cn(
                  "uppercase tracking-wider shrink-0",
                  "bg-[var(--color-golden)] text-[var(--background)]",
                  "hover:opacity-90",
                  "w-full sm:w-auto"
                )}
              >
                Оформить
              </Button>
            </div>
          </div>
        )}

        {!questionnaireCompleted && (
          <div className="p-3 sm:p-4 lg:p-6 -mt-2 sm:-mt-4 lg:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
            <button
              onClick={() => setIsQuestionnaireOpen(true)}
              className="w-full p-3 sm:p-4 lg:p-6 bg-[var(--color-golden)] hover:opacity-90 transition-opacity text-left rounded-none"
            >
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--background)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-0.5 sm:mb-1 text-[var(--background)]">Пройти анкетирование</h3>
                  <p className="text-xs sm:text-sm text-[var(--background)]/80 leading-relaxed">
                    Помогите нам узнать ваши предпочтения для идеального свидания
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onComplete={handleQuestionnaireComplete}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        isQuestionnaireCompleted={questionnaireCompleted}
        onOpenQuestionnaire={() => {
          setIsSubscriptionModalOpen(false);
          setIsQuestionnaireOpen(true);
        }}
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

