"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";
import { useAppStore } from "@/stores/useAppStore";
import { useCabinetStore } from "@/app/(cabinet)/stores/useCabinetStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const { fetchProfile } = useCabinetStore();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [isResetCodeOpen, setIsResetCodeOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [isShaking, setIsShaking] = useState(false);
  const [isResetShaking, setIsResetShaking] = useState(false);
  const verifyInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const resetInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [registeredPassword, setRegisteredPassword] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (registerData.password !== registerData.passwordConfirm) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Ошибка регистрации");
      }

      // Сохраняем пароль для последующего логина после подтверждения
      setRegisteredPassword(registerData.password);
      // Открываем модальное окно для подтверждения email
      setVerifyEmail(registerData.email);
      setIsVerifyEmailOpen(true);
      // Не закрываем основное модальное окно, просто переключаемся на подтверждение
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Ошибка входа");
      }

      setAuth({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      });

      await fetchProfile();
      onClose();
      router.push("/cabinet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Ошибка отправки");
      }

      setIsForgotPasswordOpen(false);
      setIsResetCodeOpen(true);
      setResetCode(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setIsLoading(false);
    }
  };

  // Автофокус на первый input при открытии модального окна
  useEffect(() => {
    if (isVerifyEmailOpen && verifyInputRefs.current[0]) {
      setTimeout(() => {
        verifyInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isVerifyEmailOpen]);

  useEffect(() => {
    if (isResetCodeOpen && resetInputRefs.current[0]) {
      setTimeout(() => {
        resetInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isResetCodeOpen]);

  const handleVerifyCodeChange = (index: number, value: string) => {
    // Разрешаем только цифры
    const digit = value.replace(/\D/g, "");
    if (digit.length > 1) return;

    const newCode = [...verifyCode];
    newCode[index] = digit;
    setVerifyCode(newCode);
    setError(null);

    // Автофокус на следующий input при вводе
    if (digit && index < 5) {
      verifyInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Обработка Backspace
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      verifyInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = ["", "", "", "", "", ""];
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    setVerifyCode(newCode);
    setError(null);

    // Фокус на последний заполненный input или первый пустой
    const lastFilledIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    setTimeout(() => {
      verifyInputRefs.current[focusIndex]?.focus();
    }, 0);
  };

  const handleResetCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "");
    if (digit.length > 1) return;

    const newCode = [...resetCode];
    newCode[index] = digit;
    setResetCode(newCode);
    setError(null);

    if (digit && index < 5) {
      resetInputRefs.current[index + 1]?.focus();
    }
  };

  const handleResetCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
      resetInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = ["", "", "", "", "", ""];
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    setResetCode(newCode);
    setError(null);

    const lastFilledIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    setTimeout(() => {
      resetInputRefs.current[focusIndex]?.focus();
    }, 0);
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const codeString = resetCode.join("");

    if (codeString.length !== 6) {
      setError("Введите полный код");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeString }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setIsResetShaking(true);
        setTimeout(() => {
          setIsResetShaking(false);
          setResetCode(["", "", "", "", "", ""]);
          resetInputRefs.current[0]?.focus();
        }, 500);
        throw new Error("Неверный или истекший код");
      }

      setIsResetCodeOpen(false);
      setIsResetPasswordOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка проверки кода");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (newPassword !== newPasswordConfirm) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: resetCode.join(""),
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Если код неверный (например, истек), возвращаемся к вводу кода с анимацией
        if (response.status === 400 && data.message?.includes("code")) {
          setIsResetPasswordOpen(false);
          setIsResetCodeOpen(true);
          setIsResetShaking(true);
          setResetCode(["", "", "", "", "", ""]);
          setTimeout(() => {
            setIsResetShaking(false);
            resetInputRefs.current[0]?.focus();
          }, 500);
          setError("Код истек или неверен. Попробуйте снова.");
        } else {
          throw new Error(data.message ?? "Ошибка сброса пароля");
        }
        setIsLoading(false);
        return;
      }

      setIsResetPasswordOpen(false);
      setIsResetCodeOpen(false);
      setIsForgotPasswordOpen(false);
      setResetCode(["", "", "", "", "", ""]);
      setNewPassword("");
      setNewPasswordConfirm("");
      setForgotEmail("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сброса пароля");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const codeString = verifyCode.join("");

    if (codeString.length !== 6) {
      setError("Введите полный код");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verifyEmail,
          code: codeString,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Анимация тряски и автоочистка
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setVerifyCode(["", "", "", "", "", ""]);
          verifyInputRefs.current[0]?.focus();
        }, 500);
        throw new Error(data.message ?? "Ошибка подтверждения");
      }

      // После успешного подтверждения автоматически логиним пользователя
      try {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: verifyEmail,
            password: registeredPassword,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.user) {
          setAuth({
            id: loginData.user._id || loginData.user.id,
            email: loginData.user.email,
            name: loginData.user.name,
            role: loginData.user.role,
          });

          await fetchProfile();
        }
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr);
        // Продолжаем даже если автологин не удался - пользователь может войти вручную
      }

      // Закрываем все модальные окна
      setIsVerifyEmailOpen(false);
      setVerifyCode(["", "", "", "", "", ""]);
      setRegisteredPassword("");
      onClose();
      // Не редиректим - остаемся на главной странице
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка подтверждения");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
        <div className="p-8">
          <div className="flex gap-4 mb-6 border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <button
              onClick={() => {
                setAuthMode("login");
                setError(null);
              }}
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
              onClick={() => {
                setAuthMode("register");
                setError(null);
              }}
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-100">
              {error}
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
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
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium mb-2">
                  Имя
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
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
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
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
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
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
                  value={registerData.passwordConfirm}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      passwordConfirm: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => {
          setIsForgotPasswordOpen(false);
          setForgotEmail("");
          setError(null);
        }}
        className="max-w-md"
      >
        <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-2">Восстановление пароля</h2>
          <p className="text-sm text-[var(--foreground)]/60 mb-6">
            Введите email — мы отправим код для восстановления пароля.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
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

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Отправка..." : "Отправить код"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isVerifyEmailOpen}
        onClose={() => {
          setIsVerifyEmailOpen(false);
          setVerifyCode(["", "", "", "", "", ""]);
          setError(null);
          setIsShaking(false);
        }}
        className="max-w-md"
      >
        <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-2">Подтверждение email</h2>
          <p className="text-sm text-[var(--foreground)]/60 mb-6">
            Мы отправили код подтверждения на <strong>{verifyEmail}</strong>. Введите код из письма.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3 text-center">
                Код подтверждения
              </label>
              <div
                className={cn(
                  "flex gap-2 justify-center",
                  isShaking && "animate-shake"
                )}
                onPaste={handleVerifyCodePaste}
              >
                {verifyCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      verifyInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerifyCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleVerifyCodeKeyDown(index, e)}
                    className={cn(
                      "w-12 h-14 text-center text-2xl font-bold border-2 rounded-md",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-[var(--color-golden)]",
                      "transition-all duration-200",
                      isShaking && "border-red-500 dark:border-red-500"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || verifyCode.join("").length !== 6}
              >
                {isLoading ? "Подтверждение..." : "Подтвердить email"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsVerifyEmailOpen(false);
                  setVerifyCode(["", "", "", "", "", ""]);
                  setError(null);
                  setIsShaking(false);
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isResetCodeOpen}
        onClose={() => {
          setIsResetCodeOpen(false);
          setResetCode(["", "", "", "", "", ""]);
          setError(null);
          setIsResetShaking(false);
        }}
        className="max-w-md"
      >
        <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-2">Код восстановления</h2>
          <p className="text-sm text-[var(--foreground)]/60 mb-6">
            Мы отправили код восстановления на <strong>{forgotEmail}</strong>. Введите код из письма.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyResetCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3 text-center">
                Код восстановления
              </label>
              <div
                className={cn(
                  "flex gap-2 justify-center",
                  isResetShaking && "animate-shake"
                )}
                onPaste={handleResetCodePaste}
              >
                {resetCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      resetInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleResetCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleResetCodeKeyDown(index, e)}
                    className={cn(
                      "w-12 h-14 text-center text-2xl font-bold border-2 rounded-md",
                      "bg-[var(--background)] text-[var(--foreground)]",
                      "border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-[var(--color-golden)]",
                      "transition-all duration-200",
                      isResetShaking && "border-red-500 dark:border-red-500"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || resetCode.join("").length !== 6}
              >
                {isLoading ? "Проверка..." : "Продолжить"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsResetCodeOpen(false);
                  setResetCode(["", "", "", "", "", ""]);
                  setError(null);
                  setIsResetShaking(false);
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isResetPasswordOpen}
        onClose={() => {
          setIsResetPasswordOpen(false);
          setNewPassword("");
          setNewPasswordConfirm("");
          setError(null);
        }}
        className="max-w-md"
      >
        <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-2">Новый пароль</h2>
          <p className="text-sm text-[var(--foreground)]/60 mb-6">
            Введите новый пароль для вашего аккаунта.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                Новый пароль
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="new-password-confirm" className="block text-sm font-medium mb-2">
                Подтвердите пароль
              </label>
              <input
                id="new-password-confirm"
                type="password"
                required
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-cream)]/40 dark:border-[var(--color-cream)]/30 rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Сброс пароля..." : "Установить пароль"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsResetPasswordOpen(false);
                  setNewPassword("");
                  setNewPasswordConfirm("");
                  setError(null);
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}


