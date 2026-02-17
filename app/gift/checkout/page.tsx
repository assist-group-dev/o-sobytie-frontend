"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

function GiftCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const durationId = searchParams.get("durationId") ?? "";
  const promoCode = searchParams.get("promoCode") ?? undefined;
  const fromParam = searchParams.get("from") ?? "landing";
  const successParam = searchParams.get("success") === "1";
  const failParam = searchParams.get("fail") === "1";
  const orderIdFromQuery = searchParams.get("orderId") ?? undefined;

  const [initDone, setInitDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if ((successParam || failParam) && orderIdFromQuery?.trim() && !durationId) {
      const target = fromParam === "cabinet" ? "/cabinet" : "/";
      const q = successParam ? `success=1&orderId=${encodeURIComponent(orderIdFromQuery.trim())}` : `fail=1&orderId=${encodeURIComponent(orderIdFromQuery.trim())}`;
      router.replace(`${target}?${q}`);
      return;
    }
    if ((successParam || failParam) && orderIdFromQuery?.trim()) {
      setLoading(false);
      setInitDone(true);
      setInitError(null);
      return;
    }
    if (!durationId) {
      setLoading(false);
      setInitError("Выберите тариф на главной странице или в кабинете и нажмите «Купить в подарок».");
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
        const body: { durationId: string; promoCode?: string; returnPath?: "landing" | "cabinet" } = { durationId };
        if (promoCode?.trim()) body.promoCode = promoCode.trim();
        body.returnPath = fromParam === "cabinet" ? "cabinet" : "landing";
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
  }, [durationId, promoCode, fromParam, successParam, failParam, orderIdFromQuery, router]);

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
      if (data.giftPromocodeCreated && data.giftCode) {
        const target = fromParam === "cabinet" ? "/cabinet" : "/";
        router.replace(`${target}?success=1&orderId=${encodeURIComponent(orderIdFromQuery.trim())}`);
        return;
      }
    } catch {
      setStatusError("Ошибка загрузки статуса");
    } finally {
      setStatusLoading(false);
    }
  }, [orderIdFromQuery, fromParam, router]);

  useEffect(() => {
    if (initDone && successParam && orderIdFromQuery) {
      fetchStatus();
    }
  }, [initDone, successParam, orderIdFromQuery, fetchStatus]);

  useEffect(() => {
    if (!initDone || !successParam || !orderIdFromQuery) return;
    const t = setInterval(fetchStatus, 5000);
    return () => clearInterval(t);
  }, [initDone, successParam, orderIdFromQuery, fetchStatus]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[var(--foreground)]/70">Перенаправление на оплату…</p>
      </div>
    );
  }

  if (initError != null) {
    const isNoTariff = initError.includes("Выберите тариф");
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center">
          <p className="text-[var(--foreground)]/80 mb-6">{initError}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/">
              <Button>На главную</Button>
            </Link>
            {isNoTariff && (
              <Link href="/cabinet">
                <Button variant="outline">В кабинет</Button>
              </Link>
            )}
          </div>
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

  if (initDone && successParam && orderIdFromQuery) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold uppercase">Оплата получена</h1>
          {statusLoading ? (
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
