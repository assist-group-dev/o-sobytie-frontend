"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { ArrowRight, Gift, Copy, Download, Check, Mail } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { AuthModal } from "./AuthModal";
import { fetchTariffs, formatPrice, type TariffCard } from "@/app/(landing)/utils/tariffs";

const PENDING_PROMO_KEY = "pending_promo";

function tariffDisplayPrice(
  tariff: TariffCard,
  appliedPromo: { durationId: string; discountPercent: number } | null
) {
  const applies = appliedPromo != null && appliedPromo.durationId === tariff.id;
  if (applies) {
    const discounted = Math.round(tariff.priceNumeric * (1 - appliedPromo.discountPercent / 100));
    return { price: formatPrice(discounted), originalPrice: tariff.price, fromPromo: true };
  }
  return { price: tariff.price, originalPrice: tariff.originalPrice, fromPromo: false };
}

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-1);
  return `${visibleStart}***${visibleEnd}@${domain}`;
};

type AppliedPromoDisplay = { code: string; discountPercent: number; durationId: string };

export function Cards() {
  const router = useRouter();
  const { userData, appliedPromos } = useCabinetStore();
  const [tariffs, setTariffs] = useState<TariffCard[]>([]);
  const [tariffsLoading, setTariffsLoading] = useState(true);
  const [selectedTariff, setSelectedTariff] = useState<TariffCard | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [giftTariff, setGiftTariff] = useState<TariffCard | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [appliedPromoLanding, setAppliedPromoLanding] = useState<AppliedPromoDisplay | null>(null);

  const isAuthenticated = userData !== null;
  const getEffectivePromoForTariff = (durationId: string): AppliedPromoDisplay | null =>
    isAuthenticated
      ? (appliedPromos.find((p) => p.durationId === durationId) ?? null)
      : appliedPromoLanding != null && appliedPromoLanding.durationId === durationId
        ? appliedPromoLanding
        : null;
  const email = isAuthenticated ? (userData.email as string) : userEmail;
  const maskedEmail = email ? maskEmail(email) : "";

  useEffect(() => {
    fetchTariffs().then((data) => {
      setTariffs(data);
      setTariffsLoading(false);
    });
  }, []);

  const generatePromoCode = () => {
    return `GIFT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };

  const handleBuyAsGift = () => {
    if (selectedTariff) {
      const promo = getEffectivePromoForTariff(selectedTariff.id);
      const params = new URLSearchParams({ durationId: selectedTariff.id, from: "landing" });
      if (promo?.code?.trim()) params.set("promoCode", promo.code.trim());
      router.push(`/gift/checkout?${params.toString()}`);
      setSelectedTariff(null);
      setAppliedPromoLanding(null);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail && giftTariff) {
      const code = generatePromoCode();
      setPromoCode(code);
      setIsEmailModalOpen(false);
      setIsGiftModalOpen(true);
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

  const handleOpenAuthForSubscribe = () => {
    if (appliedPromoLanding != null && selectedTariff != null) {
      try {
        sessionStorage.setItem(
          PENDING_PROMO_KEY,
          JSON.stringify({
            code: appliedPromoLanding.code,
            discountPercent: appliedPromoLanding.discountPercent,
            durationId: selectedTariff.id,
          })
        );
      } catch {
        sessionStorage.removeItem(PENDING_PROMO_KEY);
      }
    }
    setIsAuthModalOpen(true);
    setSelectedTariff(null);
  };

  return (
    <section id="tariffs" className="pt-12 pb-20 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 uppercase tracking-wider text-center lg:text-left">
          Тарифы
        </h2>

        {tariffsLoading ? (
          <p className="text-[var(--foreground)]/70 py-8">Загрузка тарифов…</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tariffs.map((tariff) => (
            <div
              key={tariff.id}
              className="group cursor-pointer"
              onClick={() => setSelectedTariff(tariff)}
            >
              <div className="relative aspect-square mb-6 overflow-hidden bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20">
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
              
                <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold uppercase">{tariff.title}</h3>
                  <div className="text-right">
                    {(() => {
                      const { price, originalPrice } = tariffDisplayPrice(tariff, getEffectivePromoForTariff(tariff.id));
                      return originalPrice != null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs line-through text-[var(--foreground)]/40">{originalPrice}</span>
                          <span className="text-sm font-bold text-[var(--color-golden)]">{price}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-[var(--foreground)]/50">{price}</span>
                      );
                    })()}
                  </div>
                </div>
                
                <p className="text-sm text-[var(--foreground)]/60 line-clamp-2">
                  {tariff.description}
                </p>
                
                <div className="pt-2">
                  <Button
                    variant="text"
                    className="group/btn p-0 flex items-center gap-2 text-sm uppercase font-bold tracking-wider hover:text-[var(--color-golden)]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTariff(tariff);
                    }}
                  >
                    Подробнее <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      <Modal
        isOpen={selectedTariff !== null}
        onClose={() => setSelectedTariff(null)}
        className="p-0 max-w-7xl w-full mx-2 sm:mx-4 max-h-[98vh] sm:max-h-[90vh]"
      >
        {selectedTariff && (
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="relative w-full h-[400px] sm:h-[450px] lg:h-auto lg:w-[55%] order-1 flex-shrink-0 lg:aspect-square">
              <div className="relative h-full w-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20">
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
                  {(() => {
                    const promoForSelected = getEffectivePromoForTariff(selectedTariff.id);
                    const { price, originalPrice, fromPromo } = tariffDisplayPrice(selectedTariff, promoForSelected);
                    if (originalPrice != null) {
                      return (
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-base sm:text-lg line-through text-[var(--foreground)]/40">{originalPrice}</span>
                            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-golden)]">{price}</span>
                          </div>
                          {fromPromo && promoForSelected != null && (
                            <span className="text-xs sm:text-sm font-medium text-[var(--color-golden)]">Скидка {promoForSelected.discountPercent}% по промокоду</span>
                          )}
                          {!fromPromo && selectedTariff.discount && (
                            <span className="text-xs sm:text-sm font-medium text-[var(--color-golden)]">{selectedTariff.discount}</span>
                          )}
                        </div>
                      );
                    }
                    return <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-golden)]">{price}</span>;
                  })()}
                </div>

                <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground)]/80 leading-relaxed mb-0 sm:mb-6 whitespace-pre-line">
                  {selectedTariff.fullDescription}
                </p>
              </div>

              <div className="mt-auto pt-2 sm:pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 space-y-2 sm:space-y-3">
                <Button
                  size="lg"
                  onClick={() => {
                    if (isAuthenticated && selectedTariff) {
                      const params = new URLSearchParams({ durationId: selectedTariff.id, subscribe: "1" });
                      router.push(`/cabinet?${params.toString()}`);
                      setSelectedTariff(null);
                    } else if (!isAuthenticated) {
                      handleOpenAuthForSubscribe();
                    }
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
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setGiftTariff(null);
          setUserEmail("");
        }}
        className="p-0 max-w-2xl w-full mx-2 sm:mx-4"
      >
        {giftTariff && (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-2">Купить в подарок</h2>
              <p className="text-base text-[var(--foreground)]/70">
                Укажите email, на который будет отправлен промокод для подписки "<span className="whitespace-nowrap">{giftTariff.title}</span>"
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                  )}
                />
                <p className="text-sm text-[var(--foreground)]/60 mt-2">
                  Промокод будет отправлен на указанный email
                </p>
              </div>

              <div className="flex gap-3 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    setGiftTariff(null);
                    setUserEmail("");
                  }}
                  className="uppercase tracking-wider"
                >
                  Отмена
                </Button>
                <Button
                  size="lg"
                  type="submit"
                  className="flex-1 uppercase tracking-wider"
                >
                  Продолжить
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setPromoCode(null);
          setGiftTariff(null);
          setUserEmail("");
        }}
        className="p-0 max-w-2xl w-full mx-2 sm:mx-4"
      >
        {promoCode && giftTariff && (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-2">Промокод создан</h2>
              <p className="text-base text-[var(--foreground)]/70">
                Ваш промокод для подписки "<span className="whitespace-nowrap">{giftTariff.title}</span>"
              </p>
            </div>

            <div className="mb-6 p-6 bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 border-2 border-[var(--color-golden)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground)]/60 mb-2">Промокод</p>
                  <p className="text-2xl font-bold font-mono tracking-wider">{promoCode}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 shrink-0",
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

            <div className="mb-6 p-4 bg-[var(--color-cream)]/10 dark:bg-[var(--color-cream)]/5 flex items-start gap-3">
              <Mail className="w-5 h-5 text-[var(--color-golden)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[var(--foreground)]/70 mb-1">
                  Промокод отправлен на вашу электронную почту
                </p>
                <p className="text-sm font-medium text-[var(--foreground)]">{maskedEmail}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadTxt}
                className="flex-1 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Скачать TXT
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  setIsGiftModalOpen(false);
                  setPromoCode(null);
                  setGiftTariff(null);
                  setUserEmail("");
                }}
                className="flex-1 uppercase tracking-wider"
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}
