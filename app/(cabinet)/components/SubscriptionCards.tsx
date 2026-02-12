"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { ArrowRight, Gift, Copy, Download, Check, Mail } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { SubscriptionPurchaseModal } from "./SubscriptionPurchaseModal";
import { fetchTariffs, type TariffCard } from "@/app/(landing)/utils/tariffs";

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-1);
  return `${visibleStart}***${visibleEnd}@${domain}`;
};

export function SubscriptionCards() {
  const { userData } = useCabinetStore();
  const [tariffs, setTariffs] = useState<TariffCard[]>([]);
  const [tariffsLoading, setTariffsLoading] = useState(true);
  const [selectedTariff, setSelectedTariff] = useState<TariffCard | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftTariff, setGiftTariff] = useState<TariffCard | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseTariff, setPurchaseTariff] = useState<TariffCard | null>(null);

  useEffect(() => {
    fetchTariffs().then((data) => {
      setTariffs(data);
      setTariffsLoading(false);
    });
  }, []);

  const router = useRouter();
  const userEmail = (userData?.email as string) ?? "";
  const maskedEmail = userEmail ? maskEmail(userEmail) : "";

  const handleBuyAsGift = () => {
    if (selectedTariff) {
      router.push(`/gift/checkout?durationId=${encodeURIComponent(selectedTariff.id)}`);
      setSelectedTariff(null);
    }
  };

  const handleCopyCode = async () => {
    if (promoCode) {
      try {
        await navigator.clipboard.writeText(promoCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  const handleDownloadTxt = () => {
    if (promoCode && giftTariff) {
      const content = `Промокод для подписки "${giftTariff.title}"\n\nПромокод: ${promoCode}\n\nСпасибо за покупку!`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `promo-code-${promoCode}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  return (
    <div className="max-w-3xl">
      {tariffsLoading ? (
        <p className="text-[var(--foreground)]/70 py-6">Загрузка тарифов…</p>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {tariffs.map((tariff) => (
          <div
            key={tariff.id}
            className="group cursor-pointer"
            onClick={() => setSelectedTariff(tariff)}
          >
            <div className="relative aspect-square mb-6 overflow-hidden bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20">
              {tariff.image ? (
                <img
                  src={tariff.image}
                  alt={tariff.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-cream)]/50" />
              )}
              {tariff.discount && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--color-golden)] text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
                    {tariff.discount}
                  </span>
                </div>
              )}
              {!tariff.discount && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--color-cream)]/80 dark:bg-[var(--color-cream)]/60 text-[var(--foreground)] text-xs font-bold px-2 py-1 uppercase tracking-wider">
                    Попробовать
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap items-start gap-2">
                <h3 className="text-lg sm:text-xl font-bold uppercase whitespace-nowrap">{tariff.title}</h3>
                <div className="text-right">
                  {tariff.originalPrice ? (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-xs line-through text-[var(--foreground)]/40">{tariff.originalPrice}</span>
                      <span className="text-sm font-bold text-[var(--color-golden)]">{tariff.price}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-[var(--foreground)]/50">{tariff.price}</span>
                  )}
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-[var(--foreground)]/60 line-clamp-2">
                {tariff.description}
              </p>
              
              <div className="pt-2">
                <Button
                  variant="text"
                  className="group/btn p-0 flex items-center gap-2 text-xs sm:text-sm uppercase font-bold tracking-wider hover:text-[var(--color-golden)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTariff(tariff);
                  }}
                >
                  Подробнее <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <Modal
        isOpen={selectedTariff !== null}
        onClose={() => setSelectedTariff(null)}
        className="p-0 max-w-7xl w-full mx-2 sm:mx-4 max-h-[98vh] sm:max-h-[90vh]"
      >
        {selectedTariff && (
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="relative w-full h-[400px] sm:h-[450px] lg:h-auto lg:w-[55%] order-1 flex-shrink-0 lg:aspect-square">
              <div className="relative h-full w-full bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20">
                {selectedTariff.image ? (
                  <img
                    src={selectedTariff.image}
                    alt={selectedTariff.title}
                    className="w-full h-full object-cover lg:object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-cream)]/50" />
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-10 flex flex-col lg:w-[45%] order-2">
              <div className="mb-2 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase mb-3 sm:mb-4">{selectedTariff.title}</h2>
                
                <div className="mb-4 sm:mb-6">
                  {selectedTariff.originalPrice ? (
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-base sm:text-lg line-through text-[var(--foreground)]/40">{selectedTariff.originalPrice}</span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-golden)]">{selectedTariff.price}</span>
                      </div>
                      {selectedTariff.discount && (
                        <span className="text-xs sm:text-sm font-medium text-[var(--color-golden)]">{selectedTariff.discount}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-golden)]">{selectedTariff.price}</span>
                  )}
                </div>

                <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground)]/80 leading-relaxed mb-0 sm:mb-6 whitespace-pre-line">
                  {selectedTariff.fullDescription}
                </p>
              </div>

              <div className="mt-auto pt-2 sm:pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 space-y-2 sm:space-y-3">
                <Button 
                  size="lg" 
                  onClick={() => {
                    setPurchaseTariff(selectedTariff);
                    setIsPurchaseModalOpen(true);
                    setSelectedTariff(null);
                  }}
                  className="w-full uppercase tracking-widest text-sm sm:text-base group/btn transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  Оформить подписку
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBuyAsGift}
                  className="w-full uppercase tracking-widest text-sm sm:text-base group/btn transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-golden)] hover:text-[var(--color-golden)] flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                  Купить в подарок
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setPromoCode(null);
          setGiftTariff(null);
        }}
        className="p-0 max-w-3xl w-full mx-2 sm:mx-4"
      >
        {promoCode && giftTariff && (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase mb-2">Промокод создан</h2>
              <p className="text-sm sm:text-base text-[var(--foreground)]/70">
                Ваш промокод для подписки "{giftTariff.title}"
              </p>
            </div>

            <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-[var(--color-cream)]/60 dark:bg-[var(--color-cream)]/10 border-2 border-[var(--color-golden)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mb-1 sm:mb-2">Промокод</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold font-mono tracking-wider break-all sm:break-normal">{promoCode}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={cn(
                    "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto",
                    "bg-[var(--color-golden)] text-[var(--background)] hover:opacity-90"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Копировать
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[var(--color-cream)]/40 dark:bg-[var(--color-cream)]/5 flex items-start gap-2 sm:gap-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-golden)] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-1">
                  Промокод отправлен на вашу электронную почту
                </p>
                <p className="text-xs sm:text-sm font-medium text-[var(--foreground)] break-all sm:break-normal">{maskedEmail}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadTxt}
                className="flex-1 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Скачать TXT
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  setIsGiftModalOpen(false);
                  setPromoCode(null);
                  setGiftTariff(null);
                }}
                className="flex-1 uppercase tracking-wider"
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {purchaseTariff && (
        <SubscriptionPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setPurchaseTariff(null);
          }}
          tariff={{
            id: purchaseTariff.id,
            title: purchaseTariff.title,
            price: purchaseTariff.price,
            priceNumeric: purchaseTariff.priceNumeric,
          }}
          onSuccess={async () => {
            const { fetchProfile } = useCabinetStore.getState();
            await fetchProfile();
            setIsPurchaseModalOpen(false);
            setPurchaseTariff(null);
          }}
        />
      )}
    </div>
  );
}

