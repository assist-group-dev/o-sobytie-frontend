"use client";

import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "default",
}: ConfirmModalProps) {
  const handleConfirm = () => {
    Promise.resolve(onConfirm()).then(() => onClose()).catch(() => {});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-md w-full mx-2 sm:mx-4">
      <div className="p-6">
        <h2 className="text-2xl font-bold uppercase mb-4">{title}</h2>
        <p className="text-[var(--foreground)]/70 mb-6 break-words">
          {message.split(/"([^"]+)"/).map((part, index) => 
            index % 2 === 1 ? (
              <span key={index} className="whitespace-nowrap">{`"${part}"`}</span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </p>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className={`flex-1 ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                : ""
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

