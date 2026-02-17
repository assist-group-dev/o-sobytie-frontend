"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Building2, Calendar, Tag, MessageSquare, Ticket, Settings, ChevronLeft, ChevronRight, Shield, UserCog, Menu, X, CreditCard } from "lucide-react";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/ui/components/ThemeToggle";
import { LoadingOverlay } from "@/ui/components/LoadingOverlay";
import { ToastContainer } from "@/app/(admin)/components/ToastContainer";
import { useAppStore } from "@/stores/useAppStore";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { id: "clients", label: "Клиенты", href: "/admin/clients", icon: Users, enabled: true },
  { id: "counterparties", label: "Контрагенты", href: "/admin/counterparties", icon: Building2, enabled: true },
  { id: "schedule", label: "Расписание", href: "/admin/schedule", icon: Calendar, enabled: true },
  { id: "tariffs", label: "Тарифы", href: "/admin/tariffs", icon: Tag, enabled: true },
  { id: "requests", label: "Обращения", href: "/admin/requests", icon: MessageSquare, enabled: true },
  { id: "promocodes", label: "Промокоды", href: "/admin/promocodes", icon: Ticket, enabled: true },
  { id: "payments", label: "Платежи", href: "/admin/payments", icon: CreditCard, enabled: true },
  { id: "administrators", label: "Администраторы", href: "/admin/administrators", icon: UserCog, enabled: true },
  { id: "general", label: "Общие", href: "/admin/general", icon: Settings, enabled: true },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [prevPathname, setPrevPathname] = useState(pathname);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const initialCheck = token && user?.role === "admin";
  
  const [isCheckingAccess, setIsCheckingAccess] = useState(!initialCheck);
  const [hasAccess, setHasAccess] = useState(initialCheck ?? false);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (!token) {
      window.location.href = "/";
      return;
    }
    
    if (user && user.role !== "admin") {
      window.location.href = "/";
      return;
    }
  }, [token, user]);

  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      setIsCheckingAccess(true);
      setHasAccess(false);
      
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      
      if (!token) {
        if (isMounted) {
          window.location.href = "/";
        }
        return;
      }

      if (user?.role === "admin") {
        if (isMounted) {
          setHasAccess(true);
          setIsCheckingAccess(false);
        }
        return;
      }

      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`);

        if (response.ok) {
          const data = await response.json();

          if (data.role !== "admin") {
            if (isMounted) {
              window.location.href = "/";
            }
            return;
          }

          if (isMounted) {
            useAppStore.getState().setAuth({
              id: data.id ?? data._id,
              email: data.email,
              name: data.name,
              role: data.role,
            });
            setHasAccess(true);
            setIsCheckingAccess(false);
          }
        } else {
          if (isMounted) {
            window.location.href = "/";
          }
        }
      } catch {
        if (isMounted) {
          window.location.href = "/";
        }
      }
    };

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true);
      setPrevPathname(pathname);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isCheckingAccess || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-golden)] mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]/70">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  const sidebarWidth = isCollapsed ? "w-64 lg:w-16" : "w-64";

  return (
    <div className="min-h-screen bg-[var(--color-peach)]/10">
      <LoadingOverlay isLoading={isLoading} />
      <ToastContainer />

      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--background)] border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 shadow-sm z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20 rounded transition-colors"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-golden)]/30 dark:bg-[var(--color-golden)]/20 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-[var(--color-golden)]" />
              </div>
              <span className="text-sm font-medium">Админ панель</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[var(--background)] border-r border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 shadow-lg z-50 transition-all duration-300 flex flex-col",
          "lg:translate-x-0",
          sidebarWidth,
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          <div className="flex items-center justify-between gap-2">
            <div className={cn(
              "flex items-center gap-3 min-w-0",
              isCollapsed ? "lg:flex-col lg:gap-2 lg:mx-auto" : "flex-1"
            )}>
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    setIsCollapsed(!isCollapsed);
                  }
                }}
                className={cn(
                  "w-10 h-10 rounded-full bg-[var(--color-golden)]/30 dark:bg-[var(--color-golden)]/20 flex items-center justify-center shrink-0 transition-colors",
                  "hover:bg-[var(--color-golden)]/40 dark:hover:bg-[var(--color-golden)]/30",
                  "lg:cursor-pointer hidden lg:flex"
                )}
                aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-[var(--color-golden)]" />
                ) : (
                  <Shield className="h-5 w-5 text-[var(--color-golden)]" />
                )}
              </button>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">Администратор</p>
                  <p className="text-xs text-[var(--foreground)]/70 truncate">Панель управления</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex p-1.5 hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20 rounded transition-colors shrink-0"
                  aria-label="Свернуть"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20 rounded transition-colors shrink-0"
                aria-label="Закрыть меню"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            if (item.enabled) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-md",
                    "hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20",
                    "hover:text-[var(--color-golden)]",
                    isActive &&
                      "bg-[var(--color-cream)]/40 dark:bg-[var(--color-cream)]/30 text-[var(--color-golden)] font-medium",
                    isCollapsed && "lg:justify-center"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={cn("truncate", isCollapsed && "lg:hidden")}>{item.label}</span>
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-md relative",
                  "opacity-50 cursor-not-allowed",
                  isCollapsed && "lg:justify-center"
                )}
                title={isCollapsed ? `${item.label} - В разработке` : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className={cn("flex items-center justify-between w-full min-w-0", isCollapsed && "lg:hidden")}>
                  <span className="truncate">{item.label}</span>
                  <span className="text-xs text-[var(--color-golden)] font-medium ml-2 shrink-0">
                    В разработке
                  </span>
                </div>
                {isCollapsed && (
                  <div className="hidden lg:block absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-golden)] rounded-full" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block p-3 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-end")}>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "transition-all duration-300",
          "lg:ml-64",
          isCollapsed && "lg:ml-16",
          "pt-14 lg:pt-0"
        )}
      >
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </React.Suspense>
  );
}
