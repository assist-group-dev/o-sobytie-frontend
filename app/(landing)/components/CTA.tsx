import { Button } from "@/ui/components/Button";

export function CTA() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[var(--color-peach-light)]">
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          Мы продаём не разовое событие, а ежемесячное ожидание счастья
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-[var(--foreground)]/80 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed">
          Клиент платит абонентскую плату и каждый месяц получает «коробку» — готовое впечатление, 
          которое он может пережить сам, в паре или с друзьями
        </p>
        <Button size="lg" className="uppercase tracking-widest w-full sm:w-auto min-w-[200px] text-sm sm:text-base">
          Оформить подписку
        </Button>
      </div>
    </section>
  );
}
