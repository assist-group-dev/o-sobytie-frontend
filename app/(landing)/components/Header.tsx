"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { Logo } from "@/ui/components/Logo";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";
import { ThemeToggle } from "@/ui/components/ThemeToggle";
import { AuthModal } from "./AuthModal";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { useAppStore } from "@/stores/useAppStore";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";

const NAV_LINKS = [
  { href: "#tariffs", label: "Тарифы" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, isAuthenticated, setAuth, logout } = useAppStore();
  const { userData, fetchProfile } = useCabinetStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Проверяем аутентификацию при загрузке компонента
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setAuth({
            id: data._id || data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          });
          await fetchProfile();
        }
      } catch (error) {
        // Пользователь не авторизован
        setAuth(null);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, setAuth, fetchProfile]);

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      useCabinetStore.getState().setUserData(null);
      setIsLogoutModalOpen(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[var(--background)]/95 backdrop-blur-md shadow-sm"
          : "bg-[var(--background)]/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo className="text-3xl" />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium hover:text-[var(--color-golden)] transition-all duration-300 uppercase tracking-wide relative group"
              style={{
                animation: `fadeInDown 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-golden)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/cabinet"
                className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-[var(--color-golden)]" />
                </div>
                <span className="text-sm font-medium hover:text-[var(--color-golden)] transition-colors">
                  {user.name}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogoutClick}
                className="flex items-center gap-2 uppercase tracking-wide text-xs font-medium border-[var(--color-golden)] text-[var(--color-golden)] hover:bg-[var(--color-golden)] hover:text-[var(--background)]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="text"
              className="flex items-center gap-2 uppercase tracking-wide text-sm font-medium group relative hover:text-[var(--color-golden)] transition-all duration-300"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative">
                Вход
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-golden)] transition-all duration-300 group-hover:w-full" />
              </span>
            </Button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-2">Выход из аккаунта</h2>
          <p className="text-sm text-[var(--foreground)]/60 mb-6">
            Вы уверены, что хотите выйти из аккаунта?
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogoutConfirm}
              className="w-full uppercase tracking-wider"
            >
              Выйти
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
              className="w-full uppercase tracking-wider"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
