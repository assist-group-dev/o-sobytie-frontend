"use client";

import { Button } from "@/ui/components/Button";

export function Hero() {
  const handleScrollToTariffs = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("tariffs");
    if (element) {
      const headerHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-[var(--color-cream-light)]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            О!СОБЫТИЕ — ваша ежемесячная порция "Вау!"
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-light">
            Надоела рутина? Подари себе О!Событие — коробку с уникальным впечатлением, 
            которое приходит к вам раз в месяц. Откройте и скажите "О!"
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="uppercase tracking-widest text-sm"
              onClick={handleScrollToTariffs}
            >
              Выбрать тариф
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-peach-light)]/20 -skew-x-12 transform origin-top-right translate-x-1/4 pointer-events-none" />
    </section>
  );
}
