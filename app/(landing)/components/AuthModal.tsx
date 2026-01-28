"use client";

import { useState } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
        <div className="p-8">
          <div className="flex gap-4 mb-6 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <button
              onClick={() => setAuthMode("login")}
              className={cn(
                "pb-3 px-2 text-sm font-medium transition-colors",
                authMode === "login"
                  ? "text-[var(--color-golden)] border-b-2 border-[var(--color-golden)]"
                  : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]/70"
              )}
            >
              Вход
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={cn(
                "pb-3 px-2 text-sm font-medium transition-colors",
                authMode === "register"
                  ? "text-[var(--color-golden)] border-b-2 border-[var(--color-golden)]"
                  : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]/70"
              )}
            >
              Регистрация
            </button>
          </div>

          {authMode === "login" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="login-password" className="block text-sm font-medium">
                    Пароль
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-[var(--foreground)]/50 hover:text-[var(--color-golden)] transition-colors"
                    onClick={() => {
                      setForgotSent(false);
                      setForgotEmail("");
                      setIsForgotPasswordOpen(true);
                    }}
                  >
                    Забыли пароль?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium mb-2">
                  Имя
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium mb-2">
                  Пароль
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label
                  htmlFor="register-password-confirm"
                  className="block text-sm font-medium mb-2"
                >
                  Подтвердите пароль
                </label>
                <input
                  id="register-password-confirm"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full">
                Зарегистрироваться
              </Button>
            </form>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        className="max-w-md"
      >
        <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-2">Восстановление пароля</h2>
          <p className="text-sm text-[var(--foreground)]/60 mb-6">
            Введите email — мы отправим ссылку для восстановления.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setForgotSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {forgotSent && (
              <p className="text-sm text-[var(--foreground)]/70">
                Если такой email существует — письмо отправлено.
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Отправить ссылку
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}


