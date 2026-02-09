"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Logo } from "@/ui/components/Logo";
import { Button } from "@/ui/components/Button";
import { ThemeToggle } from "@/ui/components/ThemeToggle";
import { AuthModal } from "./AuthModal";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { useAppStore } from "@/stores/useAppStore";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

const NAV_LINKS = [
  { href: "#tariffs", label: "Тарифы" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, setAuth } = useAppStore();
  const { fetchProfile } = useCabinetStore();

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
        const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`);
        if (response.ok) {
          const data = await response.json();
          setAuth({
            id: data._id || data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          });
          await fetchProfile();
        } else {
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
          }
          setAuth(null);
        }
      } catch (error) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        setAuth(null);
      }
    };

    if (!isAuthenticated || !user) {
      checkAuth();
    }
  }, [isAuthenticated, user, setAuth, fetchProfile]);

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
            <Link
              href="/cabinet"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center">
                <User className="h-4 w-4 text-[var(--color-golden)]" />
              </div>
              <span className="hidden sm:inline text-sm font-medium hover:text-[var(--color-golden)] transition-colors">
                {user.name}
              </span>
            </Link>
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
    </header>
  );
}
