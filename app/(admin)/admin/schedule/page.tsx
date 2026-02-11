"use client";

import { useState, useMemo } from "react";
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
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

import scheduleData from "@/app/(admin)/data/schedule.json";
import clientsData from "@/app/(admin)/data/clients.json";
import counterpartiesData from "@/app/(admin)/data/counterparties.json";

interface ScheduleEvent {
  id: string;
  clientId: string;
  counterpartyId: string;
  date: string;
  time: string;
  amount: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  eventDate: string;
  questionnaireCompleted: boolean;
  subscriptionActive: boolean;
  questionnaire: any;
  subscription: any;
}

interface Counterparty {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  contactPerson?: string;
  description?: string;
  event?: string;
}

const mockSchedule: ScheduleEvent[] = scheduleData as ScheduleEvent[];
const clients: Client[] = clientsData as Client[];
const counterparties: Counterparty[] = counterpartiesData as Counterparty[];

export default function SchedulePage() {
  const addToast = useToastStore((state) => state.addToast);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(mockSchedule);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);
  const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);

  const getClientById = (id: string) => clients.find((c) => c.id === id);
  const getCounterpartyById = (id: string) => counterparties.find((cp) => cp.id === id);

  const sortedData = useMemo(() => {
    const dataWithSortValues = schedule.map((item) => {
      const client = getClientById(item.clientId);
      const counterparty = getCounterpartyById(item.counterpartyId);
      return {
        ...item,
        _clientName: client?.name || "",
        _eventName: counterparty?.event || "Не указано",
      };
    });
    return sortData(dataWithSortValues, sortKey, sortDirection);
  }, [schedule, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, sortedData]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedEvent: ScheduleEvent) => {
    setSchedule(schedule.map((item) => (item.id === updatedEvent.id ? updatedEvent : item)));
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    addToast({
      type: "success",
      message: "Мероприятие успешно обновлено",
    });
  };

  const handleCreate = (newEvent: Omit<ScheduleEvent, "id">) => {
    const createdEvent: ScheduleEvent = {
      ...newEvent,
      id: String(schedule.length + 1),
    };
    setSchedule([...schedule, createdEvent]);
    addToast({
      type: "success",
      message: "Мероприятие успешно создано",
    });
  };

  const handleClientClick = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setIsClientModalOpen(true);
    }
  };

  const handleCounterpartyClick = (e: React.MouseEvent, counterpartyId: string) => {
    e.stopPropagation();
    const counterparty = counterparties.find((cp) => cp.id === counterpartyId);
    if (counterparty) {
      setSelectedCounterparty(counterparty);
      setIsCounterpartyModalOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAmount = (amount: string) => {
    return `${parseInt(amount).toLocaleString("ru-RU")} ₽`;
  };

  const columns = [
    {
      key: "_clientName",
      label: "Клиент",
      sortable: true,
      render: (item: ScheduleEvent) => {
        const client = getClientById(item.clientId);
        if (!client) return <span className="text-[var(--foreground)]/50">Не найден</span>;
        return (
          <button
            onClick={(e) => handleClientClick(e, item.clientId)}
            className={cn(
              "px-2 py-1 text-xs rounded cursor-pointer transition-colors",
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
              "hover:bg-blue-200 dark:hover:bg-blue-800"
            )}
          >
            {client.name}
          </button>
        );
      },
    },
    {
      key: "_eventName",
      label: "Событие",
      sortable: true,
      render: (item: ScheduleEvent) => {
        const counterparty = getCounterpartyById(item.counterpartyId);
        if (!counterparty) return <span className="text-[var(--foreground)]/50">Не найден</span>;
        const eventText = counterparty.event || "Не указано";
        return (
          <button
            onClick={(e) => handleCounterpartyClick(e, item.counterpartyId)}
            className={cn(
              "px-2 py-1 text-xs rounded cursor-pointer transition-colors",
              "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
              "hover:bg-purple-200 dark:hover:bg-purple-800"
            )}
          >
            {eventText}
          </button>
        );
      },
    },
    {
      key: "date",
      label: "Дата",
      sortable: true,
      render: (item: ScheduleEvent) => formatDate(item.date),
    },
    {
      key: "time",
      label: "Время",
      sortable: true,
      render: (item: ScheduleEvent) => item.time,
    },
    {
      key: "amount",
      label: "Сумма",
      sortable: true,
      render: (item: ScheduleEvent) => (
        <span className="font-medium text-[var(--color-golden)]">{formatAmount(item.amount)}</span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: ScheduleEvent) => (
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
            data={paginatedData}
            sortKey={sortKey || undefined}
            sortDirection={sortDirection}
            onSort={handleSort}
            onRowClick={handleView}
          />
        </div>
        <div className="p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={sortedData.length}
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
          event={selectedEvent}
          client={getClientById(selectedEvent.clientId) || null}
          counterparty={getCounterpartyById(selectedEvent.counterpartyId) || null}
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
          event={selectedEvent}
          clients={clients}
          counterparties={counterparties}
          onSave={handleSave}
        />
      )}

      {selectedClient && (
        <ClientDetailModal
          isOpen={isClientModalOpen}
          onClose={() => {
            setIsClientModalOpen(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
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
