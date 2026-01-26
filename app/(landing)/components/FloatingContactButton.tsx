"use client";

import { useState } from "react";
import { MessageCircle, Mail, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ContactOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const CONTACT_OPTIONS: ContactOption[] = [
  {
    id: "vk",
    label: "ВКонтакте",
    icon: (
      <img 
        src="/VK_Compact_Logo_(2021-present).svg" 
        alt="VK" 
        className="w-5 h-5"
      />
    ),
    href: "https://vk.com/osobytie",
    color: "bg-[#0077FF]",
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    href: "https://t.me/osobytie",
    color: "bg-[#0088cc]",
  },
  {
    id: "ticket",
    label: "Создать тикет",
    icon: <MessageCircle className="w-5 h-5" />,
    href: "mailto:support@osobytie.com?subject=Создать тикет",
    color: "bg-[var(--color-golden)]",
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="w-5 h-5" />,
    href: "mailto:info@osobytie.com",
    color: "bg-[var(--color-cream)]",
  },
];

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (href: string) => {
    if (href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative flex flex-col-reverse items-end gap-4">
        <button
          onClick={handleToggle}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
            "bg-[var(--color-golden)] hover:bg-[var(--color-golden)]/90 text-white",
            "hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:ring-offset-2"
          )}
          aria-label={isOpen ? "Закрыть меню связи" : "Открыть меню связи"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>

        {[...CONTACT_OPTIONS].reverse().map((option, index) => (
          <a
            key={option.id}
            href={option.href}
            onClick={(e) => {
              e.preventDefault();
              handleOptionClick(option.href);
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer",
              option.color,
              option.id === "email" 
                ? "text-[var(--foreground)]" 
                : "text-white",
              "hover:scale-110 hover:shadow-xl",
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : `${(CONTACT_OPTIONS.length - index - 1) * 50}ms`,
            }}
            aria-label={option.label}
          >
            <span className="text-sm font-medium whitespace-nowrap">{option.label}</span>
            <div className="flex-shrink-0">{option.icon}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

