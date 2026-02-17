"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { Copy, Download, Check, Gift } from "lucide-react";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

function GiftCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const durationId = searchParams.get("durationId") ?? "";
  const promoCode = searchParams.get("promoCode") ?? undefined;
  const successParam = searchParams.get("success") === "1";
  const failParam = searchParams.get("fail") === "1";
  const orderIdFromQuery = searchParams.get("orderId") ?? undefined;

  const [initDone, setInitDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!durationId) {
      setLoading(false);
      setInitError("Не указан тариф");
      return;
    }
    if (successParam || failParam) {
      setLoading(false);
      setInitDone(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
          const returnUrl = `/gift/checkout?durationId=${encodeURIComponent(durationId)}${promoCode ? `&promoCode=${encodeURIComponent(promoCode)}` : ""}`;
          router.replace(`/?login=1&returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }
        const body: { durationId: string; promoCode?: string } = { durationId };
        if (promoCode?.trim()) body.promoCode = promoCode.trim();
        const response = await fetchWithAuth(`${API_BASE_URL}/payments/gift/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const err = (await response.json()) as { message?: string };
          if (!cancelled) setInitError(err.message ?? "Ошибка инициализации");
          return;
        }
        const data = (await response.json()) as { paymentURL: string; orderId: string };
        if (!cancelled && data.paymentURL) {
          window.location.href = data.paymentURL;
          return;
        }
        if (!cancelled) setInitError("Не получена ссылка на оплату");
      } catch {
        if (!cancelled) setInitError("Ошибка загрузки");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [durationId, promoCode, successParam, failParam, router]);

  const fetchStatus = useCallback(async () => {
    if (!orderIdFromQuery?.trim()) return;
    setStatusLoading(true);
    setStatusError(null);
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/payments/status?orderId=${encodeURIComponent(orderIdFromQuery.trim())}`
      );
      if (!response.ok) {
        if (response.status === 404) setStatusError("Платёж не найден");
        else setStatusError("Ошибка загрузки статуса");
        return;
      }
      const data = (await response.json()) as {
        status: string;
        type: string;
        giftPromocodeCreated?: boolean;
        giftCode?: string;
      };
      if (data.giftPromocodeCreated && data.giftCode) setCode(data.giftCode);
    } catch {
      setStatusError("Ошибка загрузки статуса");
    } finally {
      setStatusLoading(false);
    }
  }, [orderIdFromQuery]);

  useEffect(() => {
    if (initDone && successParam && orderIdFromQuery) {
      fetchStatus();
    }
  }, [initDone, successParam, orderIdFromQuery, fetchStatus]);

  useEffect(() => {
    if (!initDone || !successParam || !orderIdFromQuery || code != null) return;
    const t = setInterval(fetchStatus, 5000);
    return () => clearInterval(t);
  }, [initDone, successParam, orderIdFromQuery, code, fetchStatus]);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatusError("Не удалось скопировать");
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[var(--foreground)]/70">Перенаправление на оплату…</p>
      </div>
    );
  }

  if (initError != null) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center">
          <p className="text-[var(--foreground)]/80 mb-6">{initError}</p>
          <Link href="/">
            <Button>На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (initDone && failParam) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center">
          <h1 className="text-2xl font-bold uppercase mb-4">Оплата не прошла</h1>
          <p className="text-[var(--foreground)]/80 mb-6">Можно попробовать оформить подарок снова.</p>
          <Link href="/">
            <Button>На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (code != null) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Gift className="h-16 w-16 text-[var(--color-golden)]" />
          </div>
          <h1 className="text-2xl font-bold uppercase">Промокод создан</h1>
          <p className="text-[var(--foreground)]/70">
            Передайте этот код получателю подарка. Он сможет оформить подписку со скидкой 100%.
          </p>
          <p className="text-2xl font-bold font-mono tracking-wider break-all">{code}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={handleCopy} className="flex items-center gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Скопировано" : "Копировать"}
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Скачать
            </Button>
          </div>
          <Link href="/">
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (initDone && successParam && orderIdFromQuery) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold uppercase">Оплата получена</h1>
          {statusLoading && !code ? (
            <p className="text-[var(--foreground)]/70">Ожидаем подтверждение от платёжной системы…</p>
          ) : statusError ? (
            <p className="text-[var(--foreground)]/70">{statusError}</p>
          ) : (
            <p className="text-[var(--foreground)]/70">Промокод создаётся. Обновите страницу через несколько секунд.</p>
          )}
          <Link href="/">
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

export default function GiftCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-[var(--foreground)]/70">Загрузка…</p>
        </div>
      }
    >
      <GiftCheckoutContent />
    </Suspense>
  );
}
