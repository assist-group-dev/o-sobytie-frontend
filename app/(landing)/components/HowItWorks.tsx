"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Выбираете подписку",
    description: "Подписка — это обещание, которое вы даёте своим отношениям. Выберите срок и начните отсчёт до вашего следующего приключения.",
    image: "/how-it-works/hiw-1.png",
  },
  {
    number: "02",
    title: "Получаете загадочную коробку",
    description: "В назначенный день вас ждёт красивая коробка. Внутри — всё для начала вашего свидания: изящный намёк на предстоящее событие и конверт с деталями.",
    image: "/how-it-works/hiw-2.png",
  },
  {
    number: "03",
    title: "Переживаете впечатление",
    description: "Просто следуйте инструкции. Всё уже продумано, забронировано и ждёт именно вас. Ваша единственная задача — быть здесь и сейчас.",
    image: "/how-it-works/hiw-3.png",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-8 sm:pt-10 lg:pt-16 pb-12 sm:pb-16 lg:pb-32 bg-[var(--background)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 uppercase tracking-wider">
            Как это работает
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--foreground)]/70 max-w-2xl mx-auto">
            От скучных свиданий — к незабываемым моментам. <span className="whitespace-nowrap">Всего за 3 шага.</span>
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground)]/60 mt-3 sm:mt-4 max-w-2xl mx-auto">
            Мы взяли на себя все сложности организации, чтобы вы могли сосредоточиться только друг на друге.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20 lg:space-y-32">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-6 sm:gap-8 lg:gap-12`}
            >
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative aspect-square max-w-xs sm:max-w-sm lg:max-w-md mx-auto overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 shadow-lg sm:shadow-xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={`flex-1 text-center lg:text-left w-full ${index === 1 ? "sm:pl-6 md:pl-10 lg:pl-16 xl:pl-0" : ""}`}>
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--color-golden)]/20 dark:text-[var(--color-golden)]/30">
                    {step.number}
                  </span>
                  <div className="h-px flex-1 bg-[var(--color-cream)]/50 dark:bg-[var(--color-cream)]/30 hidden lg:block max-w-xs" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground)]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-32 text-center">
          <div className="inline-flex flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 rounded-full">
            <CheckCircle className="hidden sm:block w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-golden)] flex-shrink-0" />
            <p className="text-sm sm:text-base lg:text-lg font-medium text-[var(--foreground)]/80">
              И так каждый месяц. Пока вы живете своей жизнью, мы ищем, тестируем и готовим для вас следующую главу.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}





