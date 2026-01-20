import { Card } from "@/ui/components/Card";

export function AdminDashboard() {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-4 text-2xl font-bold">Панель управления</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Это компонент админ панели
        </p>
      </Card>
    </div>
  );
}
