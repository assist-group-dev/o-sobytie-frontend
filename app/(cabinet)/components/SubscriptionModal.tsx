"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { ArrowRight, Gift, Copy, Download, Check, Mail } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { useToastStore } from "@/app/(cabinet)/stores/useToastStore";
import { SubscriptionPurchaseModal, SubscriptionFormData } from "./SubscriptionPurchaseModal";

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-1);
  return `${visibleStart}***${visibleEnd}@${domain}`;
};

interface Tariff {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  features: string[];
  details: string[];
}

const TARIFFS: Tariff[] = [
  {
    id: "1-month",
    title: "1 месяц",
    description: "Попробуйте О!СОБЫТИЕ на один месяц. Идеально для первого знакомства.",
    fullDescription: "Подписка на 1 месяц — это отличный способ познакомиться с форматом О!СОБЫТИЕ. Вы получите одну коробку с тщательно отобранным впечатлением, которое поможет вам открыть что-то новое и получить максимум удовольствия. Если вам понравится, вы всегда сможете продлить подписку на более выгодных условиях.",
    price: "2 990 ₽",
    image: "/boxes/Box_2.jpg",
    features: ["1 коробка", "Гибкая подписка", "Без обязательств"],
    details: [
      "Коробка с готовым впечатлением",
      "Материалы для незабываемого опыта",
      "Инструкции и рекомендации",
      "Возможность продления подписки",
      "Отмена в любой момент",
    ],
  },
  {
    id: "3-month",
    title: "3 месяца",
    description: "Три месяца незабываемых впечатлений с выгодой 10%. Лучший выбор для регулярных открытий.",
    fullDescription: "Подписка на 3 месяца — это оптимальный баланс между гибкостью и выгодой. Вы получаете по одной коробке в месяц с уникальными впечатлениями и экономите 10% от стоимости.\nЭто идеальный вариант для тех, кто хочет ежемесячно получать новые эмоции и открывать для себя что-то интересное.",
    price: "8 073 ₽",
    originalPrice: "8 970 ₽",
    discount: "Экономия 10%",
    image: "/boxes/Box_1.jpg",
    features: ["3 коробки", "Экономия 10%", "897 ₽ за месяц"],
    details: [
      "Три коробки с впечатлениями",
      "Экономия 897 ₽ по сравнению с помесячной оплатой",
      "Разнообразие активностей и событий",
      "Приоритетная поддержка",
      "Возможность заморозки на 1 месяц",
    ],
  },
  {
    id: "6-month",
    title: "6 месяцев",
    description: "Полгода впечатлений с максимальной выгодой 20%. Для тех, кто уверен в своём выборе.",
    fullDescription: "Подписка на 6 месяцев — это максимум выгоды (20%) и долгосрочное обещание себе. Это полгода незабываемых впечатлений: вы будете получать по одной уникальной коробке каждый месяц.\nЭто выбор для тех, кто уверен в своём желании сделать новые открытия и яркие эмоции частью своей жизни на целых полгода вперёд.",
    price: "14 352 ₽",
    originalPrice: "17 940 ₽",
    discount: "Экономия 20%",
    image: "/boxes/Box_3.jpg",
    features: ["6 коробок", "Экономия 20%", "2 392 ₽ за месяц"],
    details: [
      "Шесть коробок с впечатлениями",
      "Экономия 3 588 ₽ по сравнению с помесячной оплатой",
      "Эксклюзивные события и активности",
      "Приоритетная поддержка 24/7",
      "Возможность заморозки до 2 месяцев",
      "Бонусные материалы в каждой коробке",
    ],
  },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isQuestionnaireCompleted: boolean;
  onOpenQuestionnaire: () => void;
}

export function SubscriptionModal({ isOpen, onClose, isQuestionnaireCompleted, onOpenQuestionnaire }: SubscriptionModalProps) {
  const { userData } = useCabinetStore();
  const { addToast } = useToastStore();
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftTariff, setGiftTariff] = useState<Tariff | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseTariff, setPurchaseTariff] = useState<Tariff | null>(null);
  const [isQuestionnaireRequiredModalOpen, setIsQuestionnaireRequiredModalOpen] = useState(false);

  const userEmail = (userData?.email as string) || "ivan@example.com";
  const maskedEmail = maskEmail(userEmail);

  const generatePromoCode = () => {
    return `GIFT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };

  const handleBuyAsGift = () => {
    if (selectedTariff) {
      const code = generatePromoCode();
      setPromoCode(code);
      setGiftTariff(selectedTariff);
      setIsGiftModalOpen(true);
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

  const handleClose = () => {
    setSelectedTariff(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && selectedTariff === null}
        onClose={handleClose}
        className="p-0 max-w-7xl w-full mx-2 sm:mx-4 max-h-[98vh] sm:max-h-[90vh]"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-4 sm:mb-6">Выберите тариф</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {TARIFFS.map((tariff) => (
              <div
                key={tariff.id}
                className="group cursor-pointer"
                onClick={() => setSelectedTariff(tariff)}
              >
                <div className="relative aspect-square mb-6 overflow-hidden bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20">
                  <Image
                    src={tariff.image}
                    alt={tariff.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {tariff.discount && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[var(--color-golden)] text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
                        {tariff.discount}
                      </span>
                    </div>
                  )}
                  {!tariff.discount && tariff.id === "1-month" && (
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
        </div>
      </Modal>

      <Modal
        isOpen={selectedTariff !== null}
        onClose={() => setSelectedTariff(null)}
        className="p-0 max-w-7xl w-full mx-2 sm:mx-4 max-h-[98vh] sm:max-h-[90vh]"
      >
        {selectedTariff && (
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="relative w-full h-[400px] sm:h-[450px] lg:h-auto lg:w-[55%] order-1 flex-shrink-0 lg:aspect-square">
              <div className="relative h-full w-full bg-[var(--color-cream)]/70 dark:bg-[var(--color-cream)]/20">
                <Image
                  src={selectedTariff.image}
                  alt={selectedTariff.title}
                  fill
                  className="object-cover lg:object-contain"
                  priority
                />
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
                    if (isQuestionnaireCompleted) {
                      setPurchaseTariff(selectedTariff);
                      setIsPurchaseModalOpen(true);
                      setSelectedTariff(null);
                    } else {
                      setIsQuestionnaireRequiredModalOpen(true);
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
            handleClose();
          }}
          tariff={{
            id: purchaseTariff.id,
            title: purchaseTariff.title,
            price: purchaseTariff.price,
          }}
          onComplete={(data: SubscriptionFormData) => {
            console.log("Subscription purchase completed:", data);
            const { setSubscription } = useCabinetStore.getState();
            const deliveryDateObj = new Date(data.deliveryDate);
            const deliveryDateFormatted = deliveryDateObj.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            
            const timeSlots = [
              { value: "09:00-12:00", label: "09:00 - 12:00" },
              { value: "12:00-15:00", label: "12:00 - 15:00" },
              { value: "15:00-18:00", label: "15:00 - 18:00" },
              { value: "18:00-21:00", label: "18:00 - 21:00" },
            ];
            const deliveryTimeFormatted = timeSlots.find(slot => slot.value === data.deliveryTime)?.label || data.deliveryTime;
            
            const premiumLevelNames: Record<string, string> = {
              elegant: "Элегантный",
              cozy: "Уютный",
              special: "Особенный",
            };
            
            setSubscription({
              title: premiumLevelNames[data.premiumLevel] || data.premiumLevel,
              duration: purchaseTariff.title,
              tariff: purchaseTariff.price,
              deliveryDate: deliveryDateFormatted,
              deliveryTime: deliveryTimeFormatted,
              premiumLevel: data.premiumLevel,
              city: data.city,
              street: data.street,
              house: data.house,
              apartment: data.apartment,
              phone: data.phone,
            });
            
            addToast({
              type: "success",
              message: "Подписка успешно оформлена! Мы свяжемся с вами для подтверждения заказа.",
              duration: 5000,
            });
            
            setIsPurchaseModalOpen(false);
            setPurchaseTariff(null);
            handleClose();
          }}
        />
      )}

      <Modal
        isOpen={isQuestionnaireRequiredModalOpen}
        onClose={() => setIsQuestionnaireRequiredModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold uppercase mb-2">Анкетирование обязательно</h2>
            <p className="text-sm text-[var(--foreground)]/70">
              Для оформления подписки необходимо пройти анкетирование. Это поможет нам подобрать идеальные впечатления специально для вас.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <Button
              size="lg"
              onClick={() => {
                setIsQuestionnaireRequiredModalOpen(false);
                setSelectedTariff(null);
                onOpenQuestionnaire();
              }}
              className="uppercase tracking-wider w-full sm:flex-1"
            >
              Пройти анкету
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsQuestionnaireRequiredModalOpen(false)}
              className="uppercase tracking-wider w-full sm:flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

