"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, Edit, Plus } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { ScheduleDetailModal } from "@/app/(admin)/components/ScheduleDetailModal";
import { ScheduleEditModal } from "@/app/(admin)/components/ScheduleEditModal";
import { ScheduleCreateModal } from "@/app/(admin)/components/ScheduleCreateModal";
import { ClientDetailModal } from "@/app/(admin)/components/ClientDetailModal";
import { CounterpartyDetailModal } from "@/app/(admin)/components/CounterpartyDetailModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { cn } from "@/utils/cn";
import { API_BASE_URL, fetchWithAuth } from "@/utils/backend";

interface ScheduleEventItem {
  id: string;
  userId: string;
  counterpartyId: string;
  dateTime: string;
  amount: number;
  clientName: string;
  counterpartyName: string;
  eventName: string;
}

interface ClientForSchedule {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

interface CounterpartyForSchedule {
  id: string;
  name: string;
  event?: string;
  address?: string;
  phone?: string;
  contactPerson?: string;
  description?: string;
}

export default function SchedulePage() {
  const addToast = useToastStore((state) => state.addToast);
  const [schedule, setSchedule] = useState<ScheduleEventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("dateTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [clients, setClients] = useState<ClientForSchedule[]>([]);
  const [counterparties, setCounterparties] = useState<CounterpartyForSchedule[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientForSchedule | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] = useState<CounterpartyForSchedule | null>(null);
  const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        sortBy,
        sortOrder,
      });
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/schedule/events?${params}`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setSchedule(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      addToast({ type: "error", message: "Ошибка загрузки расписания" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, sortBy, sortOrder, addToast]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/clients`);
      if (!response.ok) return;
      const data = await response.json();
      const onlyUsers = (
        data as { id: string; name: string; email?: string; role?: string }[]
      ).filter((c) => c.role === "user");
      setClients(
        onlyUsers.map((c) => ({ id: c.id, name: c.name, email: c.email ?? "" }))
      );
    } catch {
      setClients([]);
    }
  }, []);

  const fetchCounterparties = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/counterparties`);
      if (!response.ok) return;
      const data = await response.json();
      setCounterparties(
        (data as CounterpartyForSchedule[]).map((c) => ({
          id: c.id,
          name: c.name,
          event: c.event,
          address: c.address,
          phone: c.phone,
          contactPerson: c.contactPerson,
          description: c.description,
        }))
      );
    } catch {
      setCounterparties([]);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchClients();
    fetchCounterparties();
  }, [fetchClients, fetchCounterparties]);

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const handleSort = (key: string, direction: "asc" | "desc") => {
    const map: Record<string, string> = {
      _clientName: "dateTime",
      _eventName: "dateTime",
      date: "dateTime",
      time: "dateTime",
      amount: "amount",
    };
    setSortBy(map[key] ?? "dateTime");
    setSortOrder(direction);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (event: ScheduleEventItem) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (event: ScheduleEventItem) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updated: {
    id: string;
    clientId: string;
    counterpartyId: string;
    date: string;
    time: string;
    amount: string;
  }) => {
    if (!selectedEvent) return;
    try {
      const dateTime = new Date(`${updated.date}T${updated.time}`).toISOString();
      const response = await fetchWithAuth(
        `${API_BASE_URL}/admin/schedule/events/${selectedEvent.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: updated.clientId,
            counterpartyId: updated.counterpartyId,
            dateTime,
            amount: Number(updated.amount),
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update");
      const saved = (await response.json()) as ScheduleEventItem;
      setSchedule((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
      setSelectedEvent(saved);
      addToast({ type: "success", message: "Мероприятие успешно обновлено" });
    } catch (error) {
      console.error("Error updating event:", error);
      addToast({ type: "error", message: "Ошибка сохранения мероприятия" });
    }
  };

  const handleCreate = async (newEvent: {
    clientId: string;
    counterpartyId: string;
    date: string;
    time: string;
    amount: string;
  }) => {
    try {
      const dateTime = new Date(`${newEvent.date}T${newEvent.time}`).toISOString();
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/schedule/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newEvent.clientId,
          counterpartyId: newEvent.counterpartyId,
          dateTime,
          amount: Number(newEvent.amount),
        }),
      });
      if (!response.ok) throw new Error("Failed to create");
      const created = (await response.json()) as ScheduleEventItem;
      setSchedule((prev) => [created, ...prev]);
      setTotal((t) => t + 1);
      setIsCreateModalOpen(false);
      addToast({ type: "success", message: "Мероприятие успешно создано" });
    } catch (error) {
      console.error("Error creating event:", error);
      addToast({ type: "error", message: "Ошибка создания мероприятия" });
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/admin/schedule/events/${selectedEvent.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete");
      setSchedule((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setTotal((t) => Math.max(0, t - 1));
      setIsEditModalOpen(false);
      setIsDeleteConfirmOpen(false);
      setSelectedEvent(null);
      addToast({ type: "success", message: "Мероприятие удалено" });
    } catch (error) {
      console.error("Error deleting event:", error);
      addToast({ type: "error", message: "Ошибка удаления мероприятия" });
    }
  };

  const handleClientClick = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    const client = clients.find((c) => c.id === clientId) ?? null;
    if (client) {
      setSelectedClient(client);
      setIsClientModalOpen(true);
    }
  };

  const handleCounterpartyClick = (e: React.MouseEvent, counterpartyId: string) => {
    e.stopPropagation();
    const cp = counterparties.find((c) => c.id === counterpartyId) ?? null;
    if (cp) {
      setSelectedCounterparty(cp);
      setIsCounterpartyModalOpen(true);
    }
  };

  const formatDate = (dateTimeIso: string) => {
    return new Date(dateTimeIso).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateTimeIso: string) => {
    return new Date(dateTimeIso).toTimeString().slice(0, 5);
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString("ru-RU")} ₽`;
  };

  const eventToEditShape = (e: ScheduleEventItem) => ({
    id: e.id,
    clientId: e.userId,
    counterpartyId: e.counterpartyId,
    date: e.dateTime.slice(0, 10),
    time: e.dateTime.slice(11, 16),
    amount: String(e.amount),
  });

  const columns = [
    {
      key: "clientName",
      label: "Клиент",
      sortable: true,
      render: (item: ScheduleEventItem) => (
        <button
          onClick={(e) => handleClientClick(e, item.userId)}
          className={cn(
            "px-2 py-1 text-xs rounded cursor-pointer transition-colors",
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
            "hover:bg-blue-200 dark:hover:bg-blue-800"
          )}
        >
          {item.clientName || "—"}
        </button>
      ),
    },
    {
      key: "eventName",
      label: "Событие",
      sortable: true,
      render: (item: ScheduleEventItem) => (
        <button
          onClick={(e) => handleCounterpartyClick(e, item.counterpartyId)}
          className={cn(
            "px-2 py-1 text-xs rounded cursor-pointer transition-colors",
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
            "hover:bg-purple-200 dark:hover:bg-purple-800"
          )}
        >
          {item.eventName || item.counterpartyName || "—"}
        </button>
      ),
    },
    {
      key: "date",
      label: "Дата",
      sortable: true,
      render: (item: ScheduleEventItem) => formatDate(item.dateTime),
    },
    {
      key: "time",
      label: "Время",
      sortable: true,
      render: (item: ScheduleEventItem) => formatTime(item.dateTime),
    },
    {
      key: "amount",
      label: "Сумма",
      sortable: true,
      render: (item: ScheduleEventItem) => (
        <span className="font-medium text-[var(--color-golden)]">
          {formatAmount(item.amount)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: ScheduleEventItem) => (
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

  if (isLoading && schedule.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold uppercase mb-2">Расписание</h1>
        <Card className="p-6">
          <p className="text-center">Загрузка...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase mb-2">Расписание</h1>
          <p className="text-sm text-[var(--foreground)]/60">
            Управление расписанием мероприятий
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center sm:gap-2 sm:px-5 sm:py-2.5 px-3 py-3"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Создать мероприятие</span>
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={schedule}
            sortKey={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            onRowClick={(item) => handleView(item as ScheduleEventItem)}
          />
        </div>
        <div className="p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={total}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>

      {selectedEvent && (
        <ScheduleDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEvent(null);
          }}
          event={{
            id: selectedEvent.id,
            clientId: selectedEvent.userId,
            counterpartyId: selectedEvent.counterpartyId,
            date: selectedEvent.dateTime.slice(0, 10),
            time: selectedEvent.dateTime.slice(11, 16),
            amount: String(selectedEvent.amount),
          }}
          client={(() => {
            const c = selectedClient ?? clients.find((c) => c.id === selectedEvent.userId);
            if (!c) return null;
            return {
              id: c.id,
              name: c.name,
              email: "email" in c && c.email != null ? c.email : "",
              eventDate: "",
              questionnaireCompleted: false,
              subscriptionActive: false,
              questionnaire: null,
              subscription: null,
            };
          })()}
          counterparty={
            selectedCounterparty ??
            counterparties.find((c) => c.id === selectedEvent.counterpartyId) ??
            null
          }
        />
      )}

      <ScheduleCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        clients={clients}
        counterparties={counterparties}
        onCreate={handleCreate}
      />

      {selectedEvent && (
        <ScheduleEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          event={eventToEditShape(selectedEvent)}
          clients={clients}
          counterparties={counterparties}
          onSave={handleSave}
          onDelete={handleDeleteClick}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Удаление мероприятия"
        message={`Удалить мероприятие от ${selectedEvent ? formatDate(selectedEvent.dateTime) : ""}?`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />

      {selectedClient && (
        <ClientDetailModal
          isOpen={isClientModalOpen}
          onClose={() => {
            setIsClientModalOpen(false);
            setSelectedClient(null);
          }}
          client={{
            id: selectedClient.id,
            name: selectedClient.name,
            email: selectedClient.email ?? "",
            eventDate: undefined,
            questionnaireCompleted: false,
            subscriptionActive: false,
            banned: false,
            questionnaire: undefined,
            subscription: undefined,
          }}
        />
      )}

      {selectedCounterparty && (
        <CounterpartyDetailModal
          isOpen={isCounterpartyModalOpen}
          onClose={() => {
            setIsCounterpartyModalOpen(false);
            setSelectedCounterparty(null);
          }}
          counterparty={selectedCounterparty}
        />
      )}
    </div>
  );
}
