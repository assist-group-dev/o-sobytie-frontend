"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Edit } from "lucide-react";
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

interface QuestionnaireData {
  allergies: string;
  dietaryRestrictions: string[];
  dietaryRestrictionsOther?: string;
  physicalLimitations: string[];
  physicalLimitationsOther?: string;
  fears: string[];
  fearsOther?: string;
  timePreference: string[];
  dayPreference: string[];
  additionalInfo: string;
}

interface SubscriptionData {
  premiumLevel: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  tariff: string;
  duration: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  eventDate?: string;
  questionnaireCompleted?: boolean;
  subscriptionActive?: boolean;
  banned: boolean;
  questionnaire?: QuestionnaireData;
  subscription?: SubscriptionData;
}

export default function ClientsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBanConfirmOpen, setIsBanConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/clients`);

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        setClients(
          data.map((client: any) => ({
            id: client.id,
            name: client.name,
            email: client.email,
            banned: client.banned ?? false,
            questionnaireCompleted: Math.random() > 0.5,
            subscriptionActive: Math.random() > 0.5,
          }))
        );
      } catch (error) {
        console.error("Error fetching clients:", error);
        addToast({
          type: "error",
          message: "Ошибка загрузки клиентов",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedClients = useMemo(
    () => sortData(clients, sortKey, sortDirection),
    [clients, sortKey, sortDirection]
  );

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedClients.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, sortedClients]);

  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleSave = (data: Partial<Client>) => {
    if (selectedClient) {
      setClients(
        clients.map((item) =>
          item.id === selectedClient.id ? { ...item, ...data } : item
        )
      );
      addToast({
        type: "success",
        message: `Клиент "${selectedClient.name}" успешно отредактирован`,
      });
    }
  };

  const handleBanClick = () => {
    setIsBanConfirmOpen(true);
  };

  const handleBanConfirm = async () => {
    if (selectedClient) {
      try {
        const newBannedStatus = !selectedClient.banned;
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/clients/${selectedClient.id}/ban`, {
          method: "PATCH",
          body: JSON.stringify({ banned: newBannedStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to ban/unban user");
        }

        setClients(
          clients.map((item) =>
            item.id === selectedClient.id ? { ...item, banned: newBannedStatus } : item
          )
        );
        setSelectedClient({ ...selectedClient, banned: newBannedStatus });
        setIsBanConfirmOpen(false);
        addToast({
          type: "success",
          message: `Клиент "${selectedClient.name}" ${newBannedStatus ? "забанен" : "разбанен"}`,
        });
      } catch (error) {
        console.error("Error banning user:", error);
        addToast({
          type: "error",
          message: "Ошибка при изменении статуса бана",
        });
      }
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      const deletedName = selectedClient.name;
      setClients(clients.filter((item) => item.id !== selectedClient.id));
      setSelectedClient(null);
      setIsEditModalOpen(false);
      addToast({
        type: "success",
        message: `Клиент "${deletedName}" успешно удален`,
      });
    }
  };

  const columns = [
    { key: "name", label: "Имя", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "questionnaireCompleted",
      label: "Анкета",
      sortable: true,
      render: (item: Client) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.questionnaireCompleted
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
          )}
        >
          {item.questionnaireCompleted ? "Пройдена" : "Нет"}
        </span>
      ),
    },
    {
      key: "subscriptionActive",
      label: "Подписка",
      sortable: true,
      render: (item: Client) => {
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
              item.subscriptionActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            )}
          >
            {item.subscriptionActive ? "Активна" : "Нет"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: Client) => (
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
          <h1 className="text-3xl font-bold uppercase mb-2">Клиенты</h1>
        </div>
        <Card className="p-6">
          <p className="text-center">Загрузка...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase mb-2">Клиенты</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={paginatedClients}
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
            totalItems={sortedClients.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>

      <ClientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        client={selectedClient}
      />

      <ClientEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={selectedClient}
        onSave={handleSave}
        onBan={handleBanClick}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить клиента "${selectedClient?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />

      <ConfirmModal
        isOpen={isBanConfirmOpen}
        onClose={() => setIsBanConfirmOpen(false)}
        onConfirm={handleBanConfirm}
        title={selectedClient?.banned ? "Подтверждение разбана" : "Подтверждение бана"}
        message={`Вы уверены, что хотите ${selectedClient?.banned ? "разбанить" : "забанить"} клиента "${selectedClient?.name}"?`}
        confirmText={selectedClient?.banned ? "Разбанить" : "Забанить"}
        cancelText="Отмена"
        variant={selectedClient?.banned ? "default" : "danger"}
      />
    </div>
  );
}

