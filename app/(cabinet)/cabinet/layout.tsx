"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, MessageCircle, HelpCircle, Ticket } from "lucide-react";
import { cn } from "@/utils/cn";
import { ScrollArea } from "@/ui/components/ScrollArea";
import { Logo } from "@/ui/components/Logo";
import { ThemeToggle } from "@/ui/components/ThemeToggle";

interface CabinetLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { id: "profile", label: "Профиль", href: "/cabinet", icon: User },
  { id: "subscription", label: "Подписка", href: "/cabinet/subscription", icon: CreditCard },
  { id: "contact", label: "Связь с нами", href: "/cabinet/contact", icon: MessageCircle },
  { id: "faq", label: "FAQ", href: "/cabinet/faq", icon: HelpCircle },
];

function CabinetLayoutContent({ children }: CabinetLayoutProps) {
  const pathname = usePathname();
  const [promoCode, setPromoCode] = useState("");

  const user = {
    name: "Иван Иванов",
    email: "ivan@example.com",
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Обработка промокода
    console.log("Promo code:", promoCode);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between h-10">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className="text-2xl" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="pt-16 pb-6">
        <div className="flex relative">
          <aside className="fixed left-64 top-1/2 -translate-y-1/2 w-72 h-[450px] shrink-0 rounded-xl shadow-lg border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 bg-[var(--background)]/95 backdrop-blur-sm overflow-hidden z-40 flex flex-col">
            <div className="p-4 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-[var(--color-golden)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-[var(--foreground)]/70 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/cabinet"
                      ? pathname === "/cabinet"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200",
                        "hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20",
                        "hover:text-[var(--color-golden)]",
                        isActive &&
                          "bg-[var(--color-cream)]/40 dark:bg-[var(--color-cream)]/30 text-[var(--color-golden)] font-medium"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <form onSubmit={handlePromoSubmit} className="space-y-2">
                <p className="text-xs font-medium text-[var(--foreground)]/70 mb-2 flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  Есть промо код
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите код"
                    className={cn(
                      "flex-1 px-3 py-1.5 text-sm rounded-md border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md font-medium transition-colors",
                      "bg-[var(--color-golden)] text-[var(--background)] hover:opacity-90"
                    )}
                  >
                    OK
                  </button>
                </div>
              </form>
            </div>
          </aside>

          <main className="flex-1 min-w-0 ml-[calc(18rem+1rem)] mr-4 pt-[calc(50vh-320px)]">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CabinetLayout({ children }: CabinetLayoutProps) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <CabinetLayoutContent>{children}</CabinetLayoutContent>
    </React.Suspense>
  );
}

