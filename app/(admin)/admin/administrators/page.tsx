"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Edit, UserPlus } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { ClientDetailModal } from "@/app/(admin)/components/ClientDetailModal";
import { ClientEditModal } from "@/app/(admin)/components/ClientEditModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";
import { CreateAdministratorModal } from "@/app/(admin)/components/CreateAdministratorModal";

interface QuestionnaireData {
  allergies?: string;
  dietaryRestrictions: string[];
  dietaryRestrictionsOther?: string;
  physicalLimitations: string[];
  physicalLimitationsOther?: string;
  fears: string[];
  fearsOther?: string;
  timePreference: string[];
  dayPreference: string[];
  additionalInfo?: string;
}

interface Administrator {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isActive: boolean;
  phone?: string;
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
  questionnaireCompleted?: boolean;
  questionnaire?: QuestionnaireData | null;
}

export default function AdministratorsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdministrator, setSelectedAdministrator] = useState<Administrator | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchAdministrators = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/administrators`);

      if (!response.ok) {
        throw new Error("Failed to fetch administrators");
      }

      const data = await response.json();
      setAdministrators(data);
    } catch (error) {
      console.error("Error fetching administrators:", error);
      addToast({
        type: "error",
        message: "Ошибка загрузки администраторов",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministrators();
  }, []);

  const sortedAdministrators = useMemo(
    () => sortData(administrators, sortKey, sortDirection),
    [administrators, sortKey, sortDirection]
  );

  const paginatedAdministrators = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAdministrators.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, sortedAdministrators]);

  const totalPages = Math.ceil(sortedAdministrators.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (administrator: Administrator) => {
    setSelectedAdministrator(administrator);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (administrator: Administrator) => {
    setSelectedAdministrator(administrator);
    setIsEditModalOpen(true);
  };

  const handleSave = async (data: Partial<Administrator>) => {
    if (!selectedAdministrator) return;
    const hasPersistableUpdate =
      data.name !== undefined ||
      data.phone !== undefined ||
      data.questionnaire !== undefined ||
      data.questionnaireCompleted !== undefined;
    if (hasPersistableUpdate) {
      try {
        const body: {
          name?: string;
          phone?: string | null;
          questionnaire?: QuestionnaireData;
          questionnaireCompleted?: boolean;
        } = {};
        if (data.name !== undefined) body.name = data.name;
        if (data.phone !== undefined) body.phone = data.phone;
        if (data.questionnaire != null) body.questionnaire = data.questionnaire;
        if (data.questionnaireCompleted !== undefined) body.questionnaireCompleted = data.questionnaireCompleted;
        const response = await fetchWithAuth(
          `${API_BASE_URL}/admin/clients/${selectedAdministrator.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update administrator");
        }
        const updated = (await response.json()) as Administrator;
        setAdministrators(
          administrators.map((item) =>
            item.id === selectedAdministrator.id
              ? {
                  ...item,
                  name: updated.name,
                  phone: updated.phone,
                  questionnaire: updated.questionnaire ?? item.questionnaire,
                  questionnaireCompleted: updated.questionnaireCompleted ?? false,
                }
              : item
          )
        );
        setSelectedAdministrator((prev) =>
          prev?.id === selectedAdministrator.id
            ? {
                ...prev,
                name: updated.name,
                phone: updated.phone,
                questionnaire: updated.questionnaire ?? prev.questionnaire,
                questionnaireCompleted: updated.questionnaireCompleted ?? false,
              }
            : prev
        );
        addToast({
          type: "success",
          message: `Администратор "${selectedAdministrator.name}" успешно отредактирован`,
        });
      } catch (error) {
        console.error("Error updating administrator:", error);
        addToast({
          type: "error",
          message: "Ошибка сохранения данных администратора",
        });
      }
    } else {
      setAdministrators(
        administrators.map((item) =>
          item.id === selectedAdministrator.id ? { ...item, ...data } : item
        )
      );
      setSelectedAdministrator((prev) =>
        prev?.id === selectedAdministrator.id ? (prev ? { ...prev, ...data } : null) : prev
      );
      addToast({
        type: "success",
        message: `Администратор "${selectedAdministrator.name}" успешно отредактирован`,
      });
    }
  };

  const handleRevokeAdminRights = () => {
    setIsRevokeConfirmOpen(true);
  };

  const handleRevokeConfirm = async () => {
    if (selectedAdministrator) {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/admin/administrators/${selectedAdministrator.id}/role`,
          {
            method: "PATCH",
            body: JSON.stringify({ isAdmin: false }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove admin role");
        }

        const removedName = selectedAdministrator.name;
        setAdministrators(administrators.filter((item) => item.id !== selectedAdministrator.id));
        setSelectedAdministrator(null);
        setIsEditModalOpen(false);
        addToast({
          type: "success",
          message: `Админские права у пользователя "${removedName}" успешно отозваны`,
        });
      } catch (error) {
        console.error("Error removing admin role:", error);
        addToast({
          type: "error",
          message: "Ошибка при отзыве админских прав",
        });
      }
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAdministrator) {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/admin/administrators/${selectedAdministrator.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        const deletedName = selectedAdministrator.name;
        setAdministrators(administrators.filter((item) => item.id !== selectedAdministrator.id));
        setSelectedAdministrator(null);
        setIsEditModalOpen(false);
        addToast({
          type: "success",
          message: `Пользователь "${deletedName}" успешно удален`,
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        addToast({
          type: "error",
          message: "Ошибка при удалении пользователя",
        });
      }
    }
  };

  const handleCreateSuccess = () => {
    fetchAdministrators();
    setIsCreateModalOpen(false);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    { key: "name", label: "Имя", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "banned",
      label: "Статус",
      sortable: true,
      render: (item: Administrator) => {
        if (item.banned) {
          return (
            <span
              className={cn(
                "px-2 py-1 text-xs rounded",
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              )}
            >
              Забанен
            </span>
          );
        }
        return (
          <span
            className={cn(
              "px-2 py-1 text-xs rounded",
              item.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            )}
          >
            {item.isActive ? "Активен" : "Неактивен"}
          </span>
        );
      },
    },
    {
      key: "lastLogin",
      label: "Последний вход",
      sortable: true,
      render: (item: Administrator) => formatDate(item.lastLogin || ""),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: Administrator) => (
        <div className="flex items-center gap-2">
          <Button
            variant="text"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleView(item);
            }}
            className="p-1.5"
            title="Просмотр"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="text"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
            className="p-1.5"
            title="Редактировать"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold uppercase mb-2">Администраторы</h1>
        </div>
        <Card className="p-6">
          <p className="text-center">Загрузка...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold uppercase mb-2">Администраторы</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="uppercase tracking-wider flex items-center sm:gap-2 sm:px-5 sm:py-2.5 px-3 py-3"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Создать администратора</span>
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={paginatedAdministrators}
            sortKey={sortKey || undefined}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
        <div className="p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={sortedAdministrators.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>

      <ClientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        client={selectedAdministrator as any}
      />

      <ClientEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={selectedAdministrator as any}
        onSave={handleSave}
        onRevokeAdminRights={handleRevokeAdminRights}
        onDelete={handleDeleteClick}
      />

      <CreateAdministratorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <ConfirmModal
        isOpen={isRevokeConfirmOpen}
        onClose={() => setIsRevokeConfirmOpen(false)}
        onConfirm={handleRevokeConfirm}
        title="Подтверждение отзыва прав"
        message={`Вы уверены, что хотите отозвать админские права у пользователя "${selectedAdministrator?.name}" (${selectedAdministrator?.email})? Пользователь станет обычным пользователем.`}
        confirmText="Отозвать права"
        cancelText="Отмена"
        variant="danger"
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить пользователя "${selectedAdministrator?.name}" (${selectedAdministrator?.email})? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />
    </div>
  );
}

