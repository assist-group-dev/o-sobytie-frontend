"use client";

import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";

interface QuestionnaireRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuestionnaire: () => void;
}

export function QuestionnaireRequiredModal({
  isOpen,
  onClose,
  onOpenQuestionnaire,
}: QuestionnaireRequiredModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6 sm:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold uppercase mb-2">Анкетирование обязательно</h2>
          <p className="text-sm text-[var(--foreground)]/70">
            Для оформления подписки необходимо пройти анкетирование. Это поможет нам подобрать идеальные впечатления специально для вас.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
          <Button
            size="lg"
            onClick={() => {
              onClose();
              onOpenQuestionnaire();
            }}
            className="uppercase tracking-wider w-full sm:flex-1"
          >
            Пройти анкету
          </Button>
          <Button variant="outline" size="lg" onClick={onClose} className="uppercase tracking-wider w-full sm:flex-1">
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
}
