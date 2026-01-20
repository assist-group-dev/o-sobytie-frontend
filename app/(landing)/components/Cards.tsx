"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { ArrowRight, Check } from "lucide-react";

interface Tariff {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  image: string;
  features: string[];
  details: string[];
}

const TARIFFS: Tariff[] = [
  {
    id: "solo",
    title: "СОЛО",
    description: "Для тех, кто хочет посвятить время себе. Уникальные впечатления для одного.",
    fullDescription: "Идеальный тариф для тех, кто ценит время наедине с собой. Каждый месяц вы получаете коробку с уникальным впечатлением, которое поможет вам отдохнуть, расслабиться и открыть что-то новое в себе.",
    price: "от 2 990 ₽/мес",
    image: "/boxes/Box_2.jpg",
    features: ["1 персона", "Самопознание", "Релакс"],
    details: [
      "Коробка с готовым впечатлением каждый месяц",
      "Материалы для медитации и релаксации",
      "Книги и арт-наборы для творчества",
      "Сертификаты на спа-процедуры",
      "Персональные рекомендации по развитию",
    ],
  },
  {
    id: "duet",
    title: "ДУЭТ",
    description: "Романтика или приключение для двоих. Идеально для пар и лучших друзей.",
    fullDescription: "Создавайте незабываемые моменты вместе. Каждый месяц — новое приключение для двоих: от романтических ужинов до активных квестов. Идеально для пар, которые хотят разнообразить отношения, и для друзей, ищущих совместные впечатления.",
    price: "от 4 990 ₽/мес",
    image: "/boxes/Box_1.jpg",
    features: ["2 персоны", "Романтика", "Совместный опыт"],
    details: [
      "Коробка с впечатлением для двоих",
      "Сертификаты на совместные активности",
      "Игры и квесты для пар",
      "Рецепты для романтических ужинов",
      "Фотосессии и мастер-классы",
    ],
  },
  {
    id: "party",
    title: "КОМПАНИЯ",
    description: "Веселье и драйв для компании друзей. Настолки, квесты и активности.",
    fullDescription: "Веселье для всей компании! Каждый месяц — новая коробка с активностями для друзей: настольные игры, квесты, мастер-классы и многое другое. Идеально для тех, кто любит проводить время в кругу близких.",
    price: "от 6 990 ₽/мес",
    image: "/boxes/Box_3.jpg",
    features: ["До 6 персон", "Вечеринки", "Активный отдых"],
    details: [
      "Коробка с активностями для компании",
      "Настольные игры премиум-класса",
      "Квесты и головоломки",
      "Мастер-классы и творческие наборы",
      "Сертификаты на групповые активности",
    ],
  },
];

export function Cards() {
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  return (
    <section id="tariffs" className="py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 uppercase tracking-wider text-center lg:text-left">
          Тарифы
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TARIFFS.map((tariff) => (
            <div
              key={tariff.id}
              className="group cursor-pointer"
              onClick={() => setSelectedTariff(tariff)}
            >
              <div className="relative aspect-square mb-6 overflow-hidden bg-gray-100">
                <Image
                  src={tariff.image}
                  alt={tariff.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--color-golden)] text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
                    Хит
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold uppercase">{tariff.title}</h3>
                  <span className="text-sm font-medium text-gray-500">{tariff.price}</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
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
      </div>

      <Modal
        isOpen={selectedTariff !== null}
        onClose={() => setSelectedTariff(null)}
        className="p-0 max-w-6xl"
      >
        {selectedTariff && (
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="p-8 flex flex-col lg:col-span-1">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-3xl font-bold uppercase">{selectedTariff.title}</h2>
                  <span className="text-xl font-bold text-[var(--color-golden)]">{selectedTariff.price}</span>
                </div>

                <p className="text-lg text-gray-700 mb-6">{selectedTariff.fullDescription}</p>

                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Что входит:</h3>
                  <ul className="space-y-2">
                    {selectedTariff.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-[var(--color-golden)] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 mt-auto">
                <Button 
                  size="lg" 
                  className="uppercase tracking-widest flex-1 min-w-[200px] group/btn transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Оформить подписку
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedTariff(null)}
                  className="uppercase tracking-widest group/btn transition-all duration-300 hover:scale-105 hover:border-[var(--color-golden)] hover:text-[var(--color-golden)]"
                >
                  Закрыть
                </Button>
              </div>
            </div>

            <div className="relative h-full min-h-[400px] lg:min-h-[500px] p-8 lg:col-span-2">
              <div className="relative h-full w-full overflow-hidden bg-gray-100">
                <Image
                  src={selectedTariff.image}
                  alt={selectedTariff.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
