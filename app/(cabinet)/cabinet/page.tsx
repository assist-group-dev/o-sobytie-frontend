import { Card } from "@/ui/components/Card";
import { ProfileCard } from "../components/ProfileCard";

export default function CabinetPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-[var(--foreground)]/70">
          Управляйте своим профилем и настройками
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileCard />
        
        <Card>
          <h2 className="mb-4 text-2xl font-bold">Добро пожаловать!</h2>
          <p className="text-[var(--foreground)]/70 mb-4">
            Это ваш личный кабинет. Здесь вы можете управлять заказами, настройками профиля и подпиской.
          </p>
        </Card>
      </div>
    </div>
  );
}

