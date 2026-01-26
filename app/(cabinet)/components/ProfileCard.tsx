import { Card } from "@/ui/components/Card";
import { User } from "lucide-react";

export function ProfileCard() {
  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center">
          <User className="h-8 w-8 text-[var(--color-golden)]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Профиль</h2>
          <p className="text-sm text-[var(--foreground)]/70">
            Управление личными данными
          </p>
        </div>
      </div>
      <div className="space-y-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
        <div>
          <p className="text-sm text-[var(--foreground)]/60 mb-1">Имя</p>
          <p className="text-[var(--foreground)]">Пользователь</p>
        </div>
        <div>
          <p className="text-sm text-[var(--foreground)]/60 mb-1">Email</p>
          <p className="text-[var(--foreground)]">user@example.com</p>
        </div>
      </div>
    </Card>
  );
}
