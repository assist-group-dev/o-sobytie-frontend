"use client";

import { useState, useEffect, useRef } from "react";
import { X, Power } from "lucide-react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";
import type { DurationApi } from "@/app/(admin)/admin/tariffs/page";

export interface DurationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  duration: DurationApi | null;
  backendUrl: string;
  onSave: (
    data: {
      name?: string;
      discountPercent?: number;
      description?: string;
      image?: string;
      isActive?: boolean;
    },
    imageFile?: File
  ) => void;
  onActivate?: () => void;
}

export function DurationEditModal({
  isOpen,
  onClose,
  duration,
  backendUrl,
  onSave,
  onActivate,
}: DurationEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [pendingImageFile, setPendingImageFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (duration) {
      setName(duration.name ?? "");
      setDiscountPercent(duration.discountPercent ?? 0);
      setDescription(duration.description ?? "");
      setIsActive(duration.isActive ?? true);
      setPendingImageFile(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (duration.image) {
        const url = duration.image.startsWith("http")
          ? duration.image
          : `${backendUrl}${duration.image}`;
        setImagePreview(url);
      } else {
        setImagePreview("");
      }
    }
  }, [duration, backendUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setPendingImageFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!duration) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imageCleared = !imagePreview && duration.image;
    onSave(
      {
        name: name.trim() || undefined,
        discountPercent,
        description: description.trim() || undefined,
        isActive,
        ...(imageCleared && { image: "" }),
      },
      pendingImageFile
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-0 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh]"
    >
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold uppercase mb-6">Редактирование срока</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Срок
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]"
                )}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="discount" className="block text-sm font-medium">
                  Размер скидки
                </label>
                <span className="text-sm font-medium text-[var(--color-golden)]">
                  {discountPercent}%
                </span>
              </div>
              <input
                id="discount"
                type="range"
                min="0"
                max="100"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-cream)] rounded-lg appearance-none cursor-pointer accent-[var(--color-golden)]"
                style={{
                  background: `linear-gradient(to right, var(--color-golden) 0%, var(--color-golden) ${discountPercent}%, var(--color-cream) ${discountPercent}%, var(--color-cream) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[var(--foreground)]/50 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Описание
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)] resize-none"
                )}
                placeholder="Описание срока подписки"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">
                Картинка
              </label>
              {imagePreview && (
                <div className="mb-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Удалить картинку"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={cn(
                  "w-full px-4 py-2 border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50",
                  "bg-[var(--background)] text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]/50 focus:border-[var(--color-golden)]",
                  "file:mr-4 file:py-2 file:px-4 file:rounded file:border-0",
                  "file:text-sm file:font-medium file:bg-[var(--color-cream)] file:text-[var(--foreground)]",
                  "file:cursor-pointer hover:file:bg-[var(--color-cream-light)]"
                )}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            {onActivate && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onActivate?.()}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2",
                  duration?.isActive
                    ? "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                )}
              >
                <Power className="h-4 w-4" />
                {duration?.isActive ? "Деактивировать" : "Активировать"}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
