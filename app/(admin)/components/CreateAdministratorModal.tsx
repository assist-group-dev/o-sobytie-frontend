"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { Search, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { ConfirmModal } from "./ConfirmModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateAdministratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAdministratorModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAdministratorModalProps) {
  const addToast = useToastStore((state) => state.addToast);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSearchEmail("");
      setSelectedUser(null);
    } else {
      setUsers([]);
    }
  }, [isOpen]);

  const fetchUsers = async (email?: string) => {
    try {
      setIsLoading(true);
      const url = email
        ? `${API_BASE_URL}/admin/administrators/users?searchEmail=${encodeURIComponent(email)}`
        : `${API_BASE_URL}/admin/administrators/users`;
      
      const response = await fetchWithAuth(url);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      addToast({
        type: "error",
        message: "Ошибка загрузки пользователей",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchEmail);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/admin/administrators/${selectedUser.id}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ isAdmin: true }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? "Failed to set admin role");
      }

      addToast({
        type: "success",
        message: `Пользователь "${selectedUser.name}" назначен администратором`,
      });

      setIsConfirmOpen(false);
      setSelectedUser(null);
      setSearchEmail("");
      setUsers([]);
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error setting admin role:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Ошибка при назначении администратора",
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold uppercase mb-6">Создать администратора</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--foreground)]/50" />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Поиск по email..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-md border",
                    "bg-[var(--background)] border-[var(--color-cream)]/30",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-golden)]",
                    "text-[var(--foreground)]"
                  )}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="uppercase tracking-wider"
                disabled={isLoading}
              >
                Найти
              </Button>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-[var(--foreground)]/70">
                Загрузка...
              </div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center text-[var(--foreground)]/70">
                Пользователи не найдены
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto border border-[var(--color-cream)]/30 rounded-md">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={cn(
                      "w-full p-4 flex items-center gap-3 hover:bg-[var(--color-cream)]/20",
                      "transition-colors border-b border-[var(--color-cream)]/20 last:border-b-0",
                      "text-left"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--color-cream)]/30 dark:bg-[var(--color-cream)]/20 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-[var(--color-golden)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-[var(--foreground)]/70 truncate">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="uppercase tracking-wider">
              Отмена
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirm}
        title="Подтверждение назначения"
        message={`Сделать пользователя "${selectedUser?.name}" (${selectedUser?.email}) администратором?`}
        confirmText="Назначить"
        cancelText="Отмена"
        variant="default"
      />
    </>
  );
}

