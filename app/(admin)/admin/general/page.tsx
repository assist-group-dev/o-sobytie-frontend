"use client";

import { Card } from "@/ui/components/Card";

export default function GeneralPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase mb-2">Общие</h1>
        <p className="text-sm text-[var(--foreground)]/60">
          Общие настройки
        </p>
      </div>

      <Card>
        <div className="p-8 text-center">
          <p className="text-[var(--foreground)]/60">
            Раздел в разработке
          </p>
        </div>
      </Card>
    </div>
  );
}


