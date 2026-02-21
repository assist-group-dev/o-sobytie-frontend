"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { Copy, Download, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

const GIFT_GUEST_EMAIL_KEY = "gift_guest_email";

function GiftPaymentSuccessContent() {
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success") === "1";
  const failParam = searchParams.get("fail") === "1";
  const orderId = searchParams.get("orderId") ?? undefined;

  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!orderId?.trim()) return;
    setLoading(true);
    setError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const guestEmail = typeof window !== "undefined" ? sessionStorage.getItem(GIFT_GUEST_EMAIL_KEY) : null;
    const statusUrl =
      token != null
        ? `${API_BASE_URL}/payments/status?orderId=${encodeURIComponent(orderId.trim())}`
        : `${API_BASE_URL}/payments/status?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(guestEmail ?? "")}`;
    try {
      const response =
        token != null ? await fetchWithAuth(statusUrl) : await fetch(statusUrl, { credentials: "include" });
      if (!response.ok) {
        if (response.status === 404) setError("Платёж не найден");
        else setError("Ошибка загрузки статуса");
        return;
      }
      const data = (await response.json()) as {
        type: string;
        giftPromocodeCreated?: boolean;
        giftCode?: string;
      };
      if (data.type === "gift" && data.giftPromocodeCreated && data.giftCode) {
        setCode(data.giftCode);
        setModalOpen(true);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem(GIFT_GUEST_EMAIL_KEY);
            sessionStorage.removeItem("gift_guest_orderId");
          } catch {
            // ignore
          }
        }
      }
    } catch {
      setError("Ошибка загрузки статуса");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (successParam && orderId?.trim() && !failParam) {
      setModalOpen(true);
      fetchStatus();
    }
  }, [successParam, failParam, orderId, fetchStatus]);

  useEffect(() => {
    if (!successParam || !orderId?.trim() || failParam || code != null) return;
    const t = setInterval(fetchStatus, 5000);
    return () => clearInterval(t);
  }, [successParam, orderId, failParam, code, fetchStatus]);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const content = `Промокод на подписку в подарок\n\nПромокод: ${code}\n\nСпасибо за покупку!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promo-code-${code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!successParam || !orderId?.trim() || failParam) return null;

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      className="p-0 max-w-2xl w-full mx-2 sm:mx-4"
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-2">Промокод создан</h2>
          <p className="text-base text-[var(--foreground)]/70">
            Передайте этот код получателю подарка. Он сможет оформить подписку со скидкой 100%.
          </p>
        </div>

        {code != null ? (
          <>
            <div className="mb-6 p-6 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 border-2 border-[var(--color-golden)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--foreground)]/60 mb-2">Промокод</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono tracking-wider break-all">{code}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto",
                    "bg-[var(--color-golden)] text-[var(--background)] hover:opacity-90"
                  )}
                >
                  {copied ? (
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
                onClick={handleDownload}
                className="flex-1 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Скачать
              </Button>
              <Button size="lg" onClick={() => setModalOpen(false)} className="flex-1 uppercase tracking-wider">
                Закрыть
              </Button>
            </div>
          </>
        ) : (
          <div className="py-6">
            {loading && !error ? (
              <p className="text-[var(--foreground)]/70">Загрузка статуса…</p>
            ) : error ? (
              <p className="text-[var(--foreground)]/70">{error}</p>
            ) : (
              <p className="text-[var(--foreground)]/70">Ожидаем подтверждение от платёжной системы…</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function GiftPaymentSuccessHandler() {
  return (
    <Suspense fallback={null}>
      <GiftPaymentSuccessContent />
    </Suspense>
  );
}
