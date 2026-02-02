"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { ArrowRight, Gift } from "lucide-react";

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
    fullDescription: "Подписка на 3 месяца — это оптимальный баланс между гибкостью и выгодой. Вы получаете три коробки с уникальными впечатлениями и экономите 10% от стоимости. Это идеальный вариант для тех, кто хочет регулярно получать новые эмоции и открывать для себя что-то интересное каждый месяц.",
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
    fullDescription: "Подписка на 6 месяцев — это максимальная выгода и долгосрочное обещание себе получать незабываемые впечатления. Вы экономите 20% от стоимости и получаете шесть уникальных коробок. Это выбор для тех, кто ценит качество, разнообразие и хочет сделать впечатления частью своей жизни на полгода вперед.",
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

export function SubscriptionCards() {
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TARIFFS.map((tariff) => (
          <div
            key={tariff.id}
            className="group cursor-pointer"
            onClick={() => setSelectedTariff(tariff)}
          >
            <div className="relative aspect-square mb-6 overflow-hidden bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20">
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
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold uppercase">{tariff.title}</h3>
                <div className="text-right">
                  {tariff.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs line-through text-[var(--foreground)]/40">{tariff.originalPrice}</span>
                      <span className="text-sm font-bold text-[var(--color-golden)]">{tariff.price}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-[var(--foreground)]/50">{tariff.price}</span>
                  )}
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

      <Modal
        isOpen={selectedTariff !== null}
        onClose={() => setSelectedTariff(null)}
        className="p-0 max-w-7xl w-full mx-2 sm:mx-4 max-h-[98vh] sm:max-h-[90vh]"
      >
        {selectedTariff && (
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="relative w-full h-[400px] sm:h-[450px] lg:h-auto lg:w-[55%] order-1 flex-shrink-0 lg:aspect-square">
              <div className="relative h-full w-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20">
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

                <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground)]/80 leading-relaxed mb-0 sm:mb-6">
                  {selectedTariff.fullDescription}
                </p>
              </div>

              <div className="mt-auto pt-2 sm:pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 space-y-2 sm:space-y-3">
                <Button 
                  size="lg" 
                  className="w-full uppercase tracking-widest text-sm sm:text-base group/btn transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  Оформить подписку
                </Button>
                <Button
                  variant="outline"
                  size="lg"
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
    </div>
  );
}

