"use client";

import { useState } from "react";
import { Mail, MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { cn } from "@/utils/cn";

const CONTACT_OPTIONS = [
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/osobytie",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: "bg-[#0088cc] hover:bg-[#0088cc]/90",
  },
  {
    id: "vk",
    label: "ВКонтакте",
    href: "https://vk.com/osobytie",
    icon: (
      <img 
        src="/VK_Compact_Logo_(2021-present).svg" 
        alt="VK" 
        className="w-6 h-6"
      />
    ),
    color: "bg-[#0077FF] hover:bg-[#0077FF]/90",
  },
];

const EMAIL = "info@osobytie.com";

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<"telegram" | "whatsapp" | "email">("email");
  const [formData, setFormData] = useState({
    subject: "",
    contact: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead form submitted:", { ...formData, contactMethod });
    setIsModalOpen(false);
    setFormData({ subject: "", contact: "", message: "" });
    setContactMethod("email");
  };

  const handleContactClick = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 -mt-8 sm:-mt-12 lg:-mt-16">
      <div className="flex flex-col gap-0 max-w-3xl">
        <div className="p-4 sm:p-8 pt-14 sm:pt-18 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
          <div className="space-y-3 sm:space-y-4">
            {CONTACT_OPTIONS.map((option) => (
              <a
                key={option.id}
                href={option.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleContactClick(option.href);
                }}
                className={cn(
                  "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-white transition-all duration-200",
                  "hover:scale-[1.02] hover:shadow-lg",
                  option.color
                )}
              >
                <div className="flex-shrink-0">{option.icon}</div>
                <span className="font-medium text-sm sm:text-base">{option.label}</span>
              </a>
            ))}
            
            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-[var(--color-cream)]/60 dark:bg-[var(--color-cream)]/10">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-golden)] flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base flex-1 min-w-0 truncate">{EMAIL}</span>
              <button
                onClick={handleCopyEmail}
                className={cn(
                  "p-2 transition-colors flex items-center justify-center shrink-0",
                  "bg-[var(--color-golden)] text-[var(--background)] hover:opacity-90",
                  copied && "bg-green-600 dark:bg-green-700"
                )}
                aria-label={copied ? "Скопировано" : "Копировать"}
              >
                {copied ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 -mt-4 sm:-mt-6 bg-[var(--color-cream)]/15 dark:bg-transparent rounded-xl">
          <Button
            size="lg"
            className="w-full uppercase tracking-wider flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Создать заявку
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Создать заявку</h2>
            <p className="text-xs sm:text-sm text-[var(--foreground)]/70">
              Заполните форму, и мы свяжемся с вами в ближайшее время
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Предпочтительный способ связи
              </label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="telegram"
                    checked={contactMethod === "telegram"}
                    onChange={(e) => setContactMethod(e.target.value as "telegram" | "whatsapp" | "email")}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Telegram</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={contactMethod === "whatsapp"}
                    onChange={(e) => setContactMethod(e.target.value as "telegram" | "whatsapp" | "email")}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">WhatsApp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={contactMethod === "email"}
                    onChange={(e) => setContactMethod(e.target.value as "telegram" | "whatsapp" | "email")}
                    className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)]"
                  />
                  <span className="text-sm">Email</span>
                </label>
              </div>
              <input
                id="contact"
                type={contactMethod === "email" ? "email" : "text"}
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)]/70 dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                placeholder={
                  contactMethod === "telegram"
                    ? "@username или номер телефона"
                    : contactMethod === "whatsapp"
                    ? "Номер телефона"
                    : "your@email.com"
                }
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Тема
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)]/70 dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                placeholder="Введите тему обращения"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Сообщение
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)]/70 dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                  "resize-none"
                )}
                placeholder="Опишите ваш вопрос или проблему"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 uppercase tracking-wider"
              >
                Отправить
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsModalOpen(false)}
                className="uppercase tracking-wider"
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

