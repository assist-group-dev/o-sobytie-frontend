"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Выбираете подписку",
    description: "Подписка — это обещание, которое вы даёте своим отношениям. Выберите срок и начните отсчёт до вашего следующего приключения.",
    image: "/boxes/Box_1.jpg",
  },
  {
    number: "02",
    title: "Получаете загадочную коробку",
    description: "В назначенный день вас ждёт красивая коробка. Внутри — всё для начала вашего свидания: изящный намёк на предстоящее событие и конверт с деталями.",
    image: "/boxes/Box_2.jpg",
  },
  {
    number: "03",
    title: "Переживаете впечатление",
    description: "Просто следуйте инструкции. Всё уже продумано, забронировано и ждёт именно вас. Ваша единственная задача — быть здесь и сейчас.",
    image: "/boxes/Box_3.jpg",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 uppercase tracking-wider">
            Как это работает
          </h2>
          <p className="text-xl text-[var(--foreground)]/70 max-w-2xl mx-auto">
            От скучных свиданий — к незабываемым моментам. Всего за 3 шага.
          </p>
          <p className="text-lg text-[var(--foreground)]/60 mt-4 max-w-2xl mx-auto">
            Мы взяли на себя все сложности организации, чтобы вы могли сосредоточиться только друг на друге.
          </p>
        </div>

        <div className="space-y-24 lg:space-y-32">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8 lg:gap-12`}
            >
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-2xl bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 shadow-xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="text-6xl lg:text-7xl font-bold text-[var(--color-golden)]/20 dark:text-[var(--color-golden)]/30">
                    {step.number}
                  </span>
                  <div className="h-px flex-1 bg-[var(--color-cream)]/50 dark:bg-[var(--color-cream)]/30 hidden lg:block" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-lg text-[var(--foreground)]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 lg:mt-32 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 rounded-full">
            <CheckCircle className="w-6 h-6 text-[var(--color-golden)]" />
            <p className="text-lg font-medium text-[var(--foreground)]/80">
              И так каждый месяц. Пока вы живете своей жизнью, мы ищем, тестируем и готовим для вас следующую главу.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


