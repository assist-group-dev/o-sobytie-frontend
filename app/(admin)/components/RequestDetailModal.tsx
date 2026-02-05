"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { Modal } from "@/ui/components/Modal";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";

type RequestStatus = "Новый" | "Просмотрен" | "Отвечен" | "В работе" | "Решен";

interface Request {
  id: string;
  name: string;
  email: string;
  subject: string;
  contactMethod: string;
  contactData?: string;
  createdAt: string;
  message: string;
  status: RequestStatus;
}

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
  onStatusChange?: (requestId: string, status: RequestStatus) => void;
  onDelete?: (requestId: string) => void;
}

const STATUS_OPTIONS: RequestStatus[] = ["Новый", "Просмотрен", "Отвечен", "В работе", "Решен"];

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case "Новый":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    case "Просмотрен":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
    case "Отвечен":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
    case "В работе":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "Решен":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
  }
};

function StatusDropdown({
  value,
  onChange,
}: {
  value: RequestStatus;
  onChange: (status: RequestStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (status: RequestStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-1.5 text-xs rounded flex items-center gap-2 transition-colors",
          "border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
          "hover:border-[var(--color-golden)]/50",
          getStatusColor(value)
        )}
      >
        <span>{value}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 z-50 min-w-[160px] border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 bg-[var(--background)] shadow-lg rounded"
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleSelect(status)}
              className={cn(
                "w-full px-3 py-2 text-xs text-left transition-all first:rounded-t last:rounded-b",
                "hover:brightness-90 hover:shadow-sm",
                value === status &&
                  "bg-[var(--color-golden)]/10 text-[var(--color-golden)] font-medium",
                getStatusColor(status)
              )}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const contactMethodNames: Record<string, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  email: "Email",
};

export function RequestDetailModal({ isOpen, onClose, request, onStatusChange, onDelete }: RequestDetailModalProps) {
  if (!request) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (onStatusChange) {
      onStatusChange(request.id, newStatus);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(request.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh]">
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Детальная информация об обращении</h2>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Имя</p>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Email</p>
                <p className="font-medium">{request.email}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Тема</p>
                <p className="font-medium">{request.subject}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Способ связи</p>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">
                    {contactMethodNames[request.contactMethod] || request.contactMethod}
                  </p>
                  {request.contactData && (
                    <p className="text-sm text-[var(--foreground)]/70">
                      {request.contactData}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-1">Время создания</p>
                <p className="font-medium">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)]/60 mb-2">Статус</p>
                <StatusDropdown value={request.status} onChange={handleStatusChange} />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Текст обращения</h3>
            <div className="bg-[var(--color-cream)]/20 dark:bg-[var(--color-cream)]/10 rounded-lg p-4">
              <p className="text-[var(--foreground)]/80 whitespace-pre-wrap leading-relaxed">
                {request.message}
              </p>
            </div>
          </Card>
        </div>

        {onDelete && (
          <div className="mt-6 pt-6 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteClick}
              className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Удалить обращение
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

