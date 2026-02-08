"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, MessageCircle, HelpCircle, Ticket, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Logo } from "@/ui/components/Logo";
import { ThemeToggle } from "@/ui/components/ThemeToggle";
import { LoadingOverlay } from "@/ui/components/LoadingOverlay";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const user = {
    name: "Иван Иванов",
    email: "ivan@example.com",
  };

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true);
      setPrevPathname(pathname);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Promo code:", promoCode);
  };

  return (
    <div className="min-h-screen bg-[var(--color-peach)]/10">
      <LoadingOverlay isLoading={isLoading} />
      <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between h-10">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className="text-2xl" />
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10 transition-colors"
                aria-label="Меню"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 sm:pt-32 lg:pt-24 xl:pt-48 2xl:pt-24 min-[1920px]:pt-48 pb-4 sm:pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
          <aside
            className={cn(
              "w-full lg:w-80 shrink-0 rounded-xl shadow-lg border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 bg-[var(--background)]/95 backdrop-blur-sm overflow-hidden flex flex-col",
              "lg:sticky lg:top-24",
              "max-lg:fixed max-lg:top-16 max-lg:inset-x-4 max-lg:w-[calc(100%-2rem)] max-lg:z-40",
              "max-lg:transition-all max-lg:duration-300 max-lg:ease-in-out",
              !isMobileMenuOpen && "max-lg:translate-y-[-100%] max-lg:opacity-0 max-lg:pointer-events-none",
              isMobileMenuOpen && "max-lg:translate-y-0 max-lg:opacity-100 max-lg:pointer-events-auto"
            )}
          >
            <div className="p-3 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
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

            <div className="p-3 space-y-1">
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200",
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

            <div className="p-3 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              <form onSubmit={handlePromoSubmit} className="space-y-2">
                <p className="text-xs font-medium text-[var(--foreground)]/70 mb-2 flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  Есть промокод?
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите код"
                    className={cn(
                      "flex-1 px-3 py-1.5 text-sm border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium transition-colors",
                      "bg-[var(--color-golden)] text-[var(--background)] hover:opacity-90"
                    )}
                  >
                    OK
                  </button>
                </div>
              </form>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
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

