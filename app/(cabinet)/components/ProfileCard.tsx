import { Card } from "@/ui/components/Card";

export function ProfileCard() {
  return (
    <Card>
      <h2 className="mb-4 text-2xl font-bold">Профиль</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Это компонент профиля в модуле личного кабинета
      </p>
    </Card>
  );
}
