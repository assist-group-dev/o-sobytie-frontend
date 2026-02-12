"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { Copy, Download, Check, Gift } from "lucide-react";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

function GiftCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const durationId = searchParams.get("durationId") ?? "";
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!durationId) {
      setLoading(false);
      setInitError("Не указан тариф");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
          const returnUrl = `/gift/checkout?durationId=${encodeURIComponent(durationId)}`;
          router.replace(`/?login=1&returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }
        const response = await fetchWithAuth(`${API_BASE_URL}/payments/gift/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ durationId }),
        });
        if (!response.ok) {
          const err = (await response.json()) as { message?: string };
          if (!cancelled) setInitError(err.message ?? "Ошибка инициализации");
          return;
        }
        const data = (await response.json()) as { orderId: string };
        if (!cancelled) setOrderId(data.orderId);
      } catch {
        if (!cancelled) setInitError("Ошибка загрузки");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [durationId, router]);

  const handleSimulatePayment = async () => {
    if (!orderId || !durationId) return;
    setCompleteError(null);
    setCompleting(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/payments/gift/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, durationId }),
      });
      if (!response.ok) {
        const err = (await response.json()) as { message?: string };
        throw new Error(err.message ?? "Ошибка оплаты");
      }
      const data = (await response.json()) as { code: string };
      setCode(data.code);
    } catch (e) {
      setCompleteError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setCompleting(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCompleteError("Не удалось скопировать");
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
        <p className="text-[var(--foreground)]/70">Загрузка…</p>
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

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="rounded-xl border border-[var(--color-cream)]/50 dark:border-[var(--color-cream)]/20 bg-[var(--background)] p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold uppercase">Оплата подарка</h1>
        <p className="text-[var(--foreground)]/70">
          Нажмите кнопку ниже, чтобы симулировать успешную оплату и получить промокод. В реальной интеграции здесь будет переход на страницу платёжного провайдера.
        </p>
        {completeError != null && (
          <p className="text-sm text-red-500">{completeError}</p>
        )}
        <Button
          onClick={handleSimulatePayment}
          disabled={completing}
          className={cn("w-full sm:w-auto", completing && "opacity-70")}
        >
          {completing ? "Создание промокода…" : "Симулировать успешную оплату"}
        </Button>
        <Link href="/">
          <Button variant="outline">Отмена</Button>
        </Link>
      </div>
    </div>
  );
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
