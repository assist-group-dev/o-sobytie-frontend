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
import { getAbsoluteApiUrl, fetchWithAuth } from "@/utils/backend";

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

export interface SubscriptionFromApi {
  id: string;
  duration: { id: string; name: string; months: number };
  premiumLevel: { id: string; name: string };
  status: string;
  startDate: string;
  nextPaymentDate: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
}

export interface SubscriptionPatchPayload {
  id: string;
  status: string;
  durationId: string;
  premiumLevelId: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
}

export type ClientSaveData = Omit<Partial<Client>, "subscription"> & {
  subscription?: SubscriptionPatchPayload;
};

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  questionnaireCompleted?: boolean;
  subscriptionActive?: boolean;
  banned: boolean;
  isActive?: boolean;
  questionnaire?: QuestionnaireData;
  subscription?: SubscriptionFromApi | null;
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
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const url = new URL(getAbsoluteApiUrl("/admin/clients"));
        if (showDeleted) url.searchParams.set("includeInactive", "true");
        const response = await fetchWithAuth(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = (await response.json()) as Array<{
          id: string;
          name: string;
          email: string;
          banned?: boolean;
          isActive?: boolean;
          questionnaireCompleted?: boolean;
          questionnaire?: QuestionnaireData;
          eventDate?: string;
          subscription?: SubscriptionFromApi | null;
        }>;
        setClients(
          data.map((client) => ({
            id: client.id,
            name: client.name,
            email: client.email,
            banned: client.banned ?? false,
            isActive: client.isActive ?? true,
            questionnaireCompleted: client.questionnaireCompleted ?? false,
            questionnaire: client.questionnaire,
            eventDate: client.eventDate,
            subscriptionActive: !!client.subscription,
            subscription: client.subscription ?? null,
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
  }, [showDeleted]);

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

  const handleSave = async (data: ClientSaveData) => {
    if (!selectedClient) return;
    const hasClientUpdate =
      data.name !== undefined ||
      data.phone !== undefined ||
      data.questionnaire !== undefined ||
      data.questionnaireCompleted !== undefined;
    const hasSubscriptionUpdate = data.subscription != null && data.subscription.id;
    const shouldDeactivateSubscription =
      data.subscriptionActive === false && selectedClient.subscription?.id != null;

    try {
      let clientAfterPatch: Client = selectedClient;
      if (hasClientUpdate) {
        const body: {
          name?: string;
          phone?: string | null;
          questionnaire?: QuestionnaireData;
          questionnaireCompleted?: boolean;
        } = {};
        if (data.name !== undefined) body.name = data.name;
        if (data.phone !== undefined) body.phone = data.phone;
        if (data.questionnaire !== undefined) body.questionnaire = data.questionnaire;
        if (data.questionnaireCompleted !== undefined) body.questionnaireCompleted = data.questionnaireCompleted;
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/clients/${selectedClient.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Failed to update client");
        const updated = (await response.json()) as Client;
        clientAfterPatch = { ...selectedClient, ...updated };
      }

      let updatedSubscription: SubscriptionFromApi | null = clientAfterPatch.subscription ?? null;
      if (shouldDeactivateSubscription && selectedClient.subscription?.id) {
        const subId = selectedClient.subscription.id;
        const subResponse = await fetchWithAuth(
          `${API_BASE_URL}/admin/subscriptions/${subId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "expired" }),
          }
        );
        if (!subResponse.ok) throw new Error("Failed to deactivate subscription");
        updatedSubscription = null;
      } else if (hasSubscriptionUpdate && data.subscription) {
        const sub = data.subscription;
        const subBody = {
          status: sub.status,
          durationId: sub.durationId,
          premiumLevelId: sub.premiumLevelId,
          city: sub.city,
          street: sub.street,
          house: sub.house,
          apartment: sub.apartment ?? "",
          phone: sub.phone,
          deliveryDate: sub.deliveryDate,
          deliveryTime: sub.deliveryTime,
        };
        const subResponse = await fetchWithAuth(
          `${API_BASE_URL}/admin/subscriptions/${sub.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subBody),
          }
        );
        if (!subResponse.ok) throw new Error("Failed to update subscription");
        updatedSubscription = (await subResponse.json()) as SubscriptionFromApi;
      }

      const updatedClient: Client = {
        ...clientAfterPatch,
        ...(hasSubscriptionUpdate && !shouldDeactivateSubscription && {
          subscription: updatedSubscription ?? null,
          subscriptionActive: updatedSubscription != null,
        }),
        ...(shouldDeactivateSubscription && { subscription: null, subscriptionActive: false }),
      };

      setClients(
        clients.map((item) =>
          item.id === selectedClient.id ? updatedClient : item
        )
      );
      setSelectedClient(updatedClient);
      addToast({
        type: "success",
        message: `Клиент "${selectedClient.name}" успешно отредактирован`,
      });
    } catch (error) {
      console.error("Error saving client:", error);
      addToast({
        type: "error",
        message: "Ошибка сохранения данных клиента",
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

  const handleRestore = async () => {
    if (!selectedClient?.id) return;
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/clients/${selectedClient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
      if (!response.ok) throw new Error("Ошибка восстановления");
      await response.json();
      setClients(clients.map((c) => (c.id === selectedClient.id ? { ...c, isActive: true } : c)));
      setSelectedClient({ ...selectedClient, isActive: true });
      addToast({ type: "success", message: `Клиент "${selectedClient.name}" восстановлен` });
    } catch (error) {
      console.error("Error restoring client:", error);
      addToast({ type: "error", message: "Ошибка восстановления клиента" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    const deletedName = selectedClient.name;
    const clientId = selectedClient.id;
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/clients/${clientId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = (await response.json()) as { message?: string };
        throw new Error(err.message ?? "Ошибка удаления клиента");
      }
      setClients(clients.filter((item) => item.id !== clientId));
      setSelectedClient(null);
      setIsEditModalOpen(false);
      setIsDeleteConfirmOpen(false);
      addToast({
        type: "success",
        message: `Клиент "${deletedName}" успешно удален`,
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Ошибка удаления клиента",
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
      key: "status",
      label: "Статус",
      sortable: true,
      render: (item: Client) => {
        if (item.isActive === false) {
          return (
            <span
              className={cn(
                "px-2 py-1 text-xs rounded",
                "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              )}
            >
              Удалён
            </span>
          );
        }
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
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            )}
          >
            Активен
          </span>
        );
      },
    },
    {
      key: "subscriptionActive",
      label: "Подписка",
      sortable: true,
      render: (item: Client) => {
        if (item.banned || item.isActive === false) {
          return <span className="text-[var(--foreground)]/40">—</span>;
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold uppercase">Клиенты</h1>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="w-4 h-4 text-[var(--color-golden)] focus:ring-[var(--color-golden)] rounded"
          />
          <span className="text-sm font-medium">Показать удалённых</span>
        </label>
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
        onBan={selectedClient?.isActive !== false ? handleBanClick : undefined}
        onDelete={selectedClient?.isActive !== false ? handleDeleteClick : undefined}
        onRestore={selectedClient?.isActive === false ? handleRestore : undefined}
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

