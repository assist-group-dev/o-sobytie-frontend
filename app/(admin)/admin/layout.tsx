"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Building2, Calendar, Tag, MessageSquare, Ticket, Settings, ChevronLeft, ChevronRight, Shield, UserCog } from "lucide-react";
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
  { id: "administrators", label: "Администраторы", href: "/admin/administrators", icon: UserCog, enabled: true },
  { id: "general", label: "Общие", href: "/admin/general", icon: Settings, enabled: true },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        console.log("[AdminLayout] No token found, redirecting to /");
        if (isMounted) {
          window.location.href = "/";
        }
        return;
      }

      if (user?.role === "admin") {
        console.log("[AdminLayout] User is admin, access granted");
        if (isMounted) {
          setHasAccess(true);
          setIsCheckingAccess(false);
        }
        return;
      }

      try {
        console.log("[AdminLayout] Checking admin access via API");
        const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`);
        
        if (response.ok) {
          const data = await response.json();
          console.log("[AdminLayout] Profile response:", { role: data.role });
          
          if (data.role !== "admin") {
            console.log("[AdminLayout] User is not admin, redirecting to /");
            if (isMounted) {
              window.location.href = "/";
            }
            return;
          }
          
          if (isMounted) {
            useAppStore.getState().setAuth({
              id: data.id || data._id,
              email: data.email,
              name: data.name,
              role: data.role,
            });
            setHasAccess(true);
            setIsCheckingAccess(false);
            console.log("[AdminLayout] Admin access confirmed");
          }
        } else {
          const status = response.status;
          console.log("[AdminLayout] Profile check failed:", { status, statusText: response.statusText });
          
          if (isMounted) {
            window.location.href = "/";
          }
        }
      } catch (error) {
        console.error("[AdminLayout] Error checking access:", error);
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

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <div className="min-h-screen bg-[var(--color-peach)]/10">
      <LoadingOverlay isLoading={isLoading} />
      <ToastContainer />
      
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[var(--background)] border-r border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 shadow-lg z-40 transition-all duration-300 flex flex-col",
          sidebarWidth
        )}
      >
        <div className="p-4 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          <div className="flex items-center justify-between gap-2">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-[var(--color-golden)]/30 dark:bg-[var(--color-golden)]/20 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-[var(--color-golden)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">Администратор</p>
                  <p className="text-xs text-[var(--foreground)]/70 truncate">Панель управления</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-golden)]/30 dark:bg-[var(--color-golden)]/20 flex items-center justify-center shrink-0 mx-auto">
                <Shield className="h-5 w-5 text-[var(--color-golden)]" />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20 rounded transition-colors shrink-0"
              aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-md",
                    "hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20",
                    "hover:text-[var(--color-golden)]",
                    isActive &&
                      "bg-[var(--color-cream)]/40 dark:bg-[var(--color-cream)]/30 text-[var(--color-golden)] font-medium",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-md relative",
                  "opacity-50 cursor-not-allowed",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? `${item.label} - В разработке` : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="truncate">{item.label}</span>
                    <span className="text-xs text-[var(--color-golden)] font-medium ml-2 shrink-0">
                      В разработке
                    </span>
                  </div>
                )}
                {isCollapsed && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-golden)] rounded-full" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-end")}>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <main className="p-6">
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
