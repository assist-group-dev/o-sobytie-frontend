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

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setAuthMode("login")}
            className={cn(
              "pb-3 px-2 text-sm font-medium transition-colors",
              authMode === "login"
                ? "text-[var(--color-golden)] border-b-2 border-[var(--color-golden)]"
                : "text-gray-500 hover:text-gray-700"
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
                : "text-gray-500 hover:text-gray-700"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                Пароль
              </label>
              <input
                id="login-password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="register-password-confirm" className="block text-sm font-medium mb-2">
                Подтвердите пароль
              </label>
              <input
                id="register-password-confirm"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
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
  );
}


