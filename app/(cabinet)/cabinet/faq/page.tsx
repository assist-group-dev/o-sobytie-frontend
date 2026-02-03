"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    category: "О продукте и формате",
    question: "Это просто подарочный сертификат на одно свидание?",
    answer: "Нет, это принципиально другой формат. Подарочный сертификат — это разовое событие. Наша подписка — это ежемесячное обещание, которое вы даёте своим отношениям. Это система, которая бережно выводит вас из рутины, создавая регулярное пространство только для вас двоих. Это не подарок на раз, а инвестиция в качество ваших совместных моментов.",
  },
  {
    id: "2",
    category: "О продукте и формате",
    question: "Что именно мы получаем каждый месяц?",
    answer: "Каждый месяц вас ждёт красивая «Коробка Ожидания», внутри которой — всё для начала вашего свидания: изящный артефакт-намёк и конверт с деталями. В конверте вы найдёте не просто информацию, а целую историю-приглашение: куда и когда прийти, что надеть, какой настрой будет уместен. Интрига — часть нашего сценария. А дальше — само впечатление: мастер-класс, приключение, ужин с сюрпризом, организованные для вас нашими проверенными партнёрами.",
  },
  {
    id: "3",
    category: "О продукте и формате",
    question: "А можно узнать заранее, что будет в следующем месяце? Я не люблю сюрпризы.",
    answer: "Весь смысл нашей подписки — в приятной неожиданности, которая избавляет вас от необходимости выбирать. Мы гарантируем качество и полное погружение. Однако мы всегда спрашиваем вас о предпочтениях и ограничениях (например, аллергии, страх высоты) при оформлении подписки, чтобы исключить неподходящие варианты. Доверьтесь нам — мы профессиональные «сценаристы» ваших свиданий.",
  },
  {
    id: "4",
    category: "Об организации и процессе",
    question: "Нам самим нужно что-то бронировать или звонить?",
    answer: "Абсолютно нет. Вся магия в том, что мы делаем всё за вас. После того как вы получили коробку с инструкциями, вам остаётся только в назначенный день и время прийти по указанному адресу (или открыть дверь). Все брони, оплаты и договорённости с партнёрами мы берём на себя.",
  },
  {
    id: "5",
    category: "Об организации и процессе",
    question: "Что делать, если мы не можем посетить впечатление в назначенную дату?",
    answer: "Жизнь вносит коррективы, и мы это понимаем. Просто сообщите нам об этом не менее чем за 72 часа до события, и мы постараемся перенести ваше посещение на другую дату (по согласованию с партнёром) или предложим альтернативу. Подробности прописаны в договоре оферты.",
  },
  {
    id: "6",
    category: "Об организации и процессе",
    question: "А если мероприятие нам не понравится?",
    answer: "Мы лично тестируем и отбираем только лучшие впечатления в городе, основываясь на глубоком анализе. Но вкусы у всех разные. Поэтому ваша честная обратная связь после каждого события — бесценна для нас. Мы внимательно изучаем каждый отзыв, чтобы делать сервис идеальным. Если что-то пошло не так по нашей вине, мы обязательно найдём способ это компенсировать.",
  },
  {
    id: "7",
    category: "Об оплате и условиях",
    question: "Что происходит после окончания срока подписки? Она продлится автоматически?",
    answer: "Нет, автоматического списания не будет. За месяц до окончания срока мы напомним вам, что цикл приключений подходит к концу, и предложим выгодные условия для продления. Решение всегда остаётся за вами.",
  },
  {
    id: "8",
    category: "Об оплате и условиях",
    question: "Можно ли отменить подписку досрочно и вернуть деньги?",
    answer: "Подписка — это commitment (обязательство) перед собой и своими отношениями. Мы, в свою очередь, берём обязательства перед партнёрами, бронируя для вас места и услуги на месяцы вперёд. Поэтому досрочный возврат за неиспользованные месяцы, к сожалению, невозможен. Однако вы всегда можете «заморозить» подписку на 1 месяц по уважительной причине (например, командировка) или передать оставшиеся месяцы друзьям.",
  },
  {
    id: "9",
    category: "Об оплате и условиях",
    question: "Можно ли приобрести подписку в подарок?",
    answer: "Конечно! Это, пожалуй, самый продуманный подарок для пары. При оформлении вы сможете указать данные получателей, дату начала подписки (например, ближе к дню рождения или годовщине), и мы красиво обыграем вручение первой коробки.",
  },
  {
    id: "10",
    category: "О деталях и безопасности",
    question: "В какие дни обычно проходят мероприятия? Только по выходным?",
    answer: "Мы стараемся планировать события на вечер будних дней (чт, пт) или выходные. Это позволяет нашим партнёрам выделить для вас лучшее время, избегая их основного наплыва клиентов. Точная дата и время всегда будут указаны в вашей коробке.",
  },
  {
    id: "11",
    category: "О деталях и безопасности",
    question: "Мы вегетарианцы / у нас аллергия / я не умею рисовать. Вы учитываете такие нюансы?",
    answer: "Обязательно! После оформления подписки мы отправим вам короткую анкету, где вы сможете указать все пищевые ограничения, аллергии, уровень физической подготовки и даже ваши пожелания (например, «хотим больше активностей» или «предпочитаем спокойный формат»). Это помогает нам кастомизировать впечатления.",
  },
  {
    id: "12",
    category: "О деталях и безопасности",
    question: "Это безопасно? На какие мероприятия вы нас отправите?",
    answer: "Безопасность и комфорт — наш приоритет. Мы сотрудничаем только с проверенными, легальными партнёрами, имеющими все необходимые разрешения. Все локации и активности проходят нашу внутреннюю проверку.",
  },
];

const CATEGORIES = [
  "О продукте и формате",
  "Об организации и процессе",
  "Об оплате и условиях",
  "О деталях и безопасности",
];

export default function FAQPage() {
  const firstCategory = CATEGORIES[0];
  const firstItem = FAQ_ITEMS.find((item) => item.category === firstCategory);
  const [openCategoryName, setOpenCategoryName] = useState<string | null>(firstCategory);
  const [openItemId, setOpenItemId] = useState<string | null>(firstItem?.id || null);

  const handleCategoryToggle = (category: string) => {
    setOpenCategoryName((prev) => {
      const newCategory = prev === category ? null : category;
      if (newCategory !== prev) {
        setOpenItemId(null);
      }
      return newCategory;
    });
  };

  const handleItemToggle = (itemId: string) => {
    setOpenItemId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <div className="space-y-3">
      {CATEGORIES.map((category) => {
        const categoryItems = FAQ_ITEMS.filter((item) => item.category === category);
        const isCategoryOpen = openCategoryName === category;
        
        return (
          <div
            key={category}
            className="bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 overflow-hidden"
          >
            <button
              onClick={() => handleCategoryToggle(category)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]/80">
                {category}
              </h3>
              <ChevronDown
                className={cn(
                  "w-5 h-5 flex-shrink-0 text-[var(--color-golden)] transition-transform duration-200",
                  isCategoryOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isCategoryOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="space-y-2 pt-2 pb-2">
                {categoryItems.map((item) => {
                  const isItemOpen = openItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-[var(--background)]/50 dark:bg-[var(--background)]/30 overflow-hidden mx-2"
                    >
                      <button
                        onClick={() => handleItemToggle(item.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <h4 className="text-sm font-medium leading-snug pr-4">{item.question}</h4>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 flex-shrink-0 text-[var(--color-golden)] transition-transform duration-200",
                            isItemOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          isItemOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="px-4 pb-3">
                          <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
