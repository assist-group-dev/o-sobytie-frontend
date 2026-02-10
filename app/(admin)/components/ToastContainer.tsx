"use client";

import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { Toast } from "@/app/(admin)/components/Toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 sm:left-auto sm:right-4 sm:w-auto z-[10000] flex flex-col gap-2 px-4 sm:px-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

