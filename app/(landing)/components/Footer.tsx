"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/ui/components/Logo";
import { Send } from "lucide-react";
import { Modal } from "@/ui/components/Modal";

type ModalType =
  | "about-project"
  | "team"
  | "vacancies"
  | "contacts"
  | "delivery"
  | "faq"
  | "privacy"
  | "offer"
  | null;

export function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="bg-[var(--background)] border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <Logo className="text-4xl" />
              </Link>
              <p className="text-sm text-[var(--foreground)]/50">
                © 2024 О!СОБЫТИЕ
                <br />
                Все права защищены.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold uppercase mb-4 tracking-wider text-sm">О нас</h4>
              <ul className="space-y-2 text-sm text-[var(--foreground)]/60">
                <li>
                  <button
                    onClick={() => openModal("about-project")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    О проекте
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("team")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    Команда
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("vacancies")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    Вакансии
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("contacts")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    Контакты
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold uppercase mb-4 tracking-wider text-sm">Клиентам</h4>
              <ul className="space-y-2 text-sm text-[var(--foreground)]/60">
                <li>
                  <button
                    onClick={() => openModal("delivery")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    Доставка и оплата
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("privacy")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    Политика конфиденциальности
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("offer")}
                    className="hover:text-[var(--color-golden)] transition-colors text-left"
                  >
                    Публичная оферта
                  </button>
                </li>
              </ul>
            </div>
          
            <div>
              <h4 className="font-bold uppercase mb-4 tracking-wider text-sm">Мы в соцсетях</h4>
              <div className="flex gap-4">
                <Link href="#" className="p-2 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 hover:bg-[var(--color-golden)] hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
                <Link href="#" className="p-2 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 hover:bg-[var(--color-golden)] hover:text-white transition-colors">
                  <Send className="h-5 w-5" />
                </Link>
                <Link href="#" className="p-2 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 hover:bg-[var(--color-golden)] hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Link>
                <Link href="#" className="p-2 bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 hover:bg-[var(--color-golden)] hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        
        <div className="text-center text-xs text-[var(--foreground)]/40 pt-8 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          Сделано с любовью к впечатлениям
        </div>
      </div>
    </footer>

    <Modal isOpen={activeModal === "about-project"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">О проекте</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-4">
          <p>
            О!СОБЫТИЕ — это уникальный проект, который дарит вам ежемесячную порцию незабываемых впечатлений. 
            Каждый месяц мы тщательно отбираем и упаковываем в коробку особое событие, которое способно 
            подарить вам настоящие эмоции и яркие воспоминания.
          </p>
          <p>
            Наша миссия — разорвать рутину повседневной жизни и подарить вам возможность открывать для себя 
            что-то новое каждый месяц. Мы верим, что впечатления — это лучший подарок, который можно себе сделать.
          </p>
          <p>
            Каждая коробка О!СОБЫТИЕ содержит уникальный опыт: от мастер-классов и экскурсий до билетов 
            на мероприятия и специальных предложений от наших партнеров. Мы работаем только с проверенными 
            организаторами и гарантируем качество каждого события.
          </p>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "team"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Команда</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-4">
          <p>
            О!СОБЫТИЕ создается командой энтузиастов, которые искренне верят в силу впечатлений и эмоций. 
            Мы объединили профессионалов из разных сфер: от event-менеджмента до маркетинга и дизайна.
          </p>
          <p>
            Наша команда работает над тем, чтобы каждый месяц вы получали коробку, которая превзойдет 
            ваши ожидания. Мы лично проверяем каждое событие, общаемся с партнерами и следим за качеством 
            на всех этапах.
          </p>
          <p>
            Мы постоянно развиваемся, ищем новые идеи и форматы, чтобы сделать О!СОБЫТИЕ еще более 
            интересным и запоминающимся. Ваши отзывы и предложения помогают нам становиться лучше.
          </p>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "vacancies"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Вакансии</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-4">
          <p>
            Мы всегда рады талантливым и увлеченным людям, которые разделяют нашу страсть к созданию 
            незабываемых впечатлений. Если вы хотите стать частью команды О!СОБЫТИЕ, мы будем рады 
            рассмотреть вашу кандидатуру.
          </p>
          <p className="font-semibold mt-6 mb-2">Открытые позиции:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Event-менеджер</li>
            <li>Маркетолог</li>
            <li>Контент-менеджер</li>
            <li>Менеджер по работе с партнерами</li>
          </ul>
          <p className="mt-6">
            Отправьте свое резюме на почту <a href="mailto:hr@osobytie.com" className="text-[var(--color-golden)] hover:underline">hr@osobytie.com</a> 
            с указанием интересующей вас позиции. Мы обязательно рассмотрим вашу заявку и свяжемся с вами.
          </p>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "contacts"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Контакты</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-6">
          <div>
            <p className="font-semibold mb-2">Электронная почта:</p>
            <p>
              <a href="mailto:info@osobytie.com" className="text-[var(--color-golden)] hover:underline">
                info@osobytie.com
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Телефон:</p>
            <p>
              <a href="tel:+78001234567" className="text-[var(--color-golden)] hover:underline">
                +7 (800) 123-45-67
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Время работы:</p>
            <p>Пн-Пт: 10:00 - 20:00<br />Сб-Вс: 11:00 - 18:00</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Адрес:</p>
            <p>г. Москва, ул. Примерная, д. 1</p>
          </div>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "delivery"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Доставка и оплата</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Способы доставки</h3>
            <p>
              Доставка коробок О!СОБЫТИЕ осуществляется курьерской службой по городу Волгоград.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Способы оплаты</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Банковской картой онлайн (Visa, MasterCard, МИР)</li>
              <li>Электронными кошельками (ЮMoney, Qiwi)</li>
              <li>Наложенным платежом при получении</li>
              <li>Банковским переводом</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Стоимость доставки</h3>
            <p>
              Доставка по Волгограду включена в стоимость подписки.
            </p>
          </div>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "faq"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Вопросы и ответы</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Как часто приходят коробки?</h3>
            <p>
              Коробки О!СОБЫТИЕ доставляются один раз в месяц. Вы можете выбрать дату доставки 
              при оформлении подписки.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Можно ли отменить подписку?</h3>
            <p>
              Да, вы можете отменить подписку в любой момент в личном кабинете. Отмена вступит 
              в силу после окончания текущего оплаченного периода.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Что делать, если коробка не пришла?</h3>
            <p>
              Если коробка не пришла в указанный срок, пожалуйста, свяжитесь с нашей службой 
              поддержки. Мы обязательно разберемся в ситуации и решим проблему.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Можно ли заказать коробку в подарок?</h3>
            <p>
              Конечно! При оформлении заказа укажите, что это подарок, и мы красиво упакуем 
              коробку и добавим поздравительную открытку.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Что делать, если событие не подошло?</h3>
            <p>
              Если событие из коробки вам не подходит, вы можете связаться с нами, и мы постараемся 
              предложить альтернативу или компенсацию.
            </p>
          </div>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "privacy"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Политика конфиденциальности</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-4">
          <p>
            О!СОБЫТИЕ обязуется защищать конфиденциальность персональных данных пользователей. 
            Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем 
            вашу персональную информацию.
          </p>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">1. Сбор информации</h3>
            <p>
              Мы собираем информацию, которую вы предоставляете при регистрации, оформлении заказа 
              или подписки: имя, адрес электронной почты, телефон, адрес доставки, платежные данные.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">2. Использование информации</h3>
            <p>
              Мы используем собранную информацию для обработки заказов, доставки коробок, связи с 
              вами по вопросам заказа, отправки информационных материалов (только с вашего согласия).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">3. Защита данных</h3>
            <p>
              Мы применяем современные технологии защиты данных, включая шифрование и безопасные 
              протоколы передачи данных. Ваши платежные данные обрабатываются через защищенные 
              платежные системы.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">4. Передача данных третьим лицам</h3>
            <p>
              Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, 
              необходимых для выполнения заказа (курьерские службы, платежные системы) или требований 
              законодательства.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">5. Ваши права</h3>
            <p>
              Вы имеете право на доступ, исправление, удаление ваших персональных данных, а также 
              право на отзыв согласия на обработку данных. Для этого свяжитесь с нами по почте 
              <a href="mailto:privacy@osobytie.com" className="text-[var(--color-golden)] hover:underline ml-1">
                privacy@osobytie.com
              </a>.
            </p>
          </div>
          <p className="mt-6 text-sm text-[var(--foreground)]/50">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </Modal>

    <Modal isOpen={activeModal === "offer"} onClose={closeModal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Публичная оферта</h2>
        <div className="prose prose-sm max-w-none text-[var(--foreground)]/80 space-y-4">
          <p>
            Настоящий документ является публичной офертой (далее — «Оферта») на заключение договора 
            оказания услуг на условиях, изложенных ниже.
          </p>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">1. Общие положения</h3>
            <p>
              Исполнитель: О!СОБЫТИЕ. Оформляя заказ или подписку, Заказчик принимает условия 
              настоящей Оферты и заключает с Исполнителем договор оказания услуг.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">2. Предмет договора</h3>
            <p>
              Исполнитель обязуется предоставить Заказчику услуги по доставке коробок с событиями 
              и впечатлениями в соответствии с выбранным тарифом подписки или единоразовым заказом.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">3. Стоимость услуг</h3>
            <p>
              Стоимость услуг указана на сайте и может изменяться Исполнителем. Изменения не 
              распространяются на уже оплаченные периоды подписки.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">4. Порядок оплаты</h3>
            <p>
              Оплата производится в соответствии с выбранным тарифом: единоразово или ежемесячно 
              при подписке. При подписке списание происходит автоматически в начале каждого периода.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">5. Возврат средств</h3>
            <p>
              Возврат средств возможен в течение 14 дней с момента оплаты, если услуга не была 
              оказана. При отмене подписки возврат средств за текущий период не производится.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 mt-6">6. Ответственность сторон</h3>
            <p>
              Исполнитель не несет ответственности за задержки доставки, вызванные действиями 
              курьерских служб или форс-мажорными обстоятельствами. Исполнитель обязуется приложить 
              все усилия для своевременной доставки.
            </p>
          </div>
          <p className="mt-6 text-sm text-[var(--foreground)]/50">
            Оформляя заказ, вы подтверждаете, что ознакомились и согласны с условиями настоящей Оферты.
          </p>
        </div>
      </div>
    </Modal>
    </>
  );
}
