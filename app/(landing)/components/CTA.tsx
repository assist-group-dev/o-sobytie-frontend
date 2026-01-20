import { Button } from "@/ui/components/Button";

export function CTA() {
  return (
    <section className="py-24 bg-[var(--color-peach-light)]">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
          Мы продаём не разовое событие, а ежемесячное ожидание счастья.
        </h2>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Клиент платит абонентскую плату и каждый месяц получает «коробку» — готовое впечатление, 
          которое он может пережить сам, в паре или с друзьями.
        </p>
        <Button size="lg" className="uppercase tracking-widest min-w-[200px]">
          Оформить подписку
        </Button>
      </div>
    </section>
  );
}
