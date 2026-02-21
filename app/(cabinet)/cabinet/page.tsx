"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { User, Package, LogOut, Mail, FileText, CheckCircle, XCircle, Copy, Download, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { QuestionnaireModal } from "@/app/(cabinet)/components/QuestionnaireModal";
import { SubscriptionModal } from "@/app/(cabinet)/components/SubscriptionModal";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { useToastStore } from "@/app/(cabinet)/stores/useToastStore";
import { useAppStore } from "@/stores/useAppStore";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface PaymentStatusResult {
  status: string;
  type: "subscription" | "gift";
  subscriptionActivated?: boolean;
  subscriptionId?: string;
  giftPromocodeCreated?: boolean;
  giftCode?: string;
}

export default function CabinetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const { subscription, userData, fetchProfile, setUserData } = useCabinetStore();
  const { logout } = useAppStore();

  const orderId = searchParams.get("orderId") ?? undefined;
  const successParam = searchParams.get("success") === "1";
  const failParam = searchParams.get("fail") === "1";
  const subscriptionActivatedParam = searchParams.get("subscriptionActivated") === "1";

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResult | null>(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState<string | null>(null);
  const [paymentPollStopped, setPaymentPollStopped] = useState(false);
  const paymentPollAttemptsRef = useRef(0);
  const [showGiftCodeModal, setShowGiftCodeModal] = useState(false);
  const [giftCodeCopied, setGiftCodeCopied] = useState(false);

  const TERMINAL_STATUSES = ["REJECTED", "REFUNDED", "REVERSED"];
  const PAYMENT_POLL_INTERVAL_MS = 8000;
  const PAYMENT_POLL_MAX_ATTEMPTS = 20;

  const fetchPaymentStatus = useCallback(async () => {
    if (!orderId?.trim()) return;
    setPaymentStatusLoading(true);
    setPaymentStatusError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/payments/status?orderId=${encodeURIComponent(orderId.trim())}`);
      if (!response.ok) {
        if (response.status === 404) setPaymentStatusError("Платёж не найден");
        else setPaymentStatusError("Ошибка загрузки статуса");
        return;
      }
      const data = (await response.json()) as PaymentStatusResult;
      setPaymentStatus(data);
    } catch {
      setPaymentStatusError("Ошибка загрузки статуса");
    } finally {
      setPaymentStatusLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (subscriptionActivatedParam && successParam) {
      setPaymentStatus({ type: "subscription", subscriptionActivated: true });
      fetchProfile().catch(() => {});
      return;
    }
    if (orderId && (successParam || failParam)) {
      fetchPaymentStatus();
    }
  }, [orderId, successParam, failParam, subscriptionActivatedParam, fetchPaymentStatus, fetchProfile]);

  useEffect(() => {
    if (!orderId || !successParam || !paymentStatus || paymentPollStopped) return;
    if (paymentStatus.type === "subscription" && paymentStatus.subscriptionActivated) return;
    if (TERMINAL_STATUSES.includes(paymentStatus.status)) return;
    const t = setInterval(() => {
      fetchPaymentStatus().then(() => {
        paymentPollAttemptsRef.current += 1;
        if (paymentPollAttemptsRef.current >= PAYMENT_POLL_MAX_ATTEMPTS) {
          setPaymentPollStopped(true);
        }
      });
    }, PAYMENT_POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [orderId, successParam, paymentStatus, paymentPollStopped, fetchPaymentStatus]);

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

  useEffect(() => {
    if (orderId && successParam && paymentStatus?.subscriptionActivated) {
      fetchProfile().catch(() => {});
    }
  }, [orderId, successParam, paymentStatus?.subscriptionActivated, fetchProfile]);

  useEffect(() => {
    if (paymentStatus?.type === "gift" && paymentStatus?.giftCode) {
      setShowGiftCodeModal(true);
    }
  }, [paymentStatus?.type, paymentStatus?.giftCode]);

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

  const showPaymentBanner =
    (orderId != null && (successParam || failParam)) || (successParam && subscriptionActivatedParam);
  const giftCode = paymentStatus?.type === "gift" ? paymentStatus.giftCode : undefined;

  const handleGiftCodeCopy = async () => {
    if (!giftCode) return;
    try {
      await navigator.clipboard.writeText(giftCode);
      setGiftCodeCopied(true);
      setTimeout(() => setGiftCodeCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleGiftCodeDownload = () => {
    if (!giftCode) return;
    const content = `Промокод на подписку в подарок\n\nПромокод: ${giftCode}\n\nСпасибо за покупку!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promo-code-${giftCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {showPaymentBanner && (
        <div
          className={cn(
            "rounded-xl border p-4 max-w-3xl",
            failParam
              ? "border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30"
              : "border-green-200 dark:border-green-900/50 bg-green-50/80 dark:bg-green-950/30"
          )}
        >
          {failParam ? (
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Оплата не прошла</p>
                <p className="text-sm text-red-700 dark:text-red-300">Можно попробовать оформить подписку снова.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 shrink-0 text-green-600 dark:text-green-400" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-green-800 dark:text-green-200">Оплата получена</p>
                {paymentStatusLoading && !paymentStatus && (
                  <p className="text-sm text-green-700 dark:text-green-300">Загрузка статуса…</p>
                )}
                {paymentStatusError && (
                  <p className="text-sm text-green-700 dark:text-green-300">{paymentStatusError}</p>
                )}
                {paymentStatus && !paymentStatusLoading && (
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {paymentStatus.type === "subscription" && paymentStatus.subscriptionActivated
                      ? "Подписка активна."
                      : paymentStatus.type === "gift" && paymentStatus.giftCode
                        ? `Промокод: ${paymentStatus.giftCode}`
                        : paymentPollStopped
                          ? "Если оплата прошла, подписка появится в течение нескольких минут. Закройте сообщение и обновите страницу позже."
                          : "Ожидаем подтверждение от платёжной системы. Обновите страницу через несколько секунд."}
                  </p>
                )}
              </div>
            </div>
          )}
          <Button
            variant="text"
            size="sm"
            className="mt-3 text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
            onClick={() => router.replace("/cabinet")}
          >
            Убрать сообщение
          </Button>
        </div>
      )}

      {giftCode != null && (
        <Modal
          isOpen={showGiftCodeModal}
          onClose={() => setShowGiftCodeModal(false)}
          className="p-0 max-w-2xl w-full mx-2 sm:mx-4"
        >
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-2">Промокод создан</h2>
              <p className="text-base text-[var(--foreground)]/70">
                Передайте этот код получателю подарка. Он сможет оформить подписку со скидкой 100%.
              </p>
            </div>

            <div className="mb-6 p-6 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 border-2 border-[var(--color-golden)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--foreground)]/60 mb-2">Промокод</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono tracking-wider break-all">{giftCode}</p>
                </div>
                <button
                  onClick={handleGiftCodeCopy}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto",
                    "bg-[var(--color-golden)] text-[var(--background)] hover:opacity-90"
                  )}
                >
                  {giftCodeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Копировать
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGiftCodeDownload}
                className="flex-1 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Скачать
              </Button>
              <Button
                size="lg"
                onClick={() => setShowGiftCodeModal(false)}
                className="flex-1 uppercase tracking-wider"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </Modal>
      )}

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

