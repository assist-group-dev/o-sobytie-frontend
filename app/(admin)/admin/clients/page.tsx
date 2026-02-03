"use client";

import { useState, useMemo } from "react";
import { Eye, Edit } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { ClientDetailModal } from "@/app/(admin)/components/ClientDetailModal";
import { ClientEditModal } from "@/app/(admin)/components/ClientEditModal";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";
import clientsData from "@/app/(admin)/data/clients.json";

interface QuestionnaireData {
  allergies: string;
  dietaryRestrictions: string[];
  physicalLimitations: string[];
  fears: string[];
  fitnessLevel: string;
  activityPreference: string;
  activityTypes: string[];
  timePreference: string[];
  dayPreference: string[];
  medicalContraindications: string;
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
  eventDate: string;
  questionnaireCompleted: boolean;
  subscriptionActive: boolean;
  questionnaire?: QuestionnaireData;
  subscription?: SubscriptionData;
}

const mockClients: Client[] = clientsData as Client[];

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedClients = useMemo(
    () => sortData(mockClients, sortKey, sortDirection),
    [sortKey, sortDirection]
  );

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedClients.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, sortedClients]);

  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
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
    console.log("Saving client data:", data);
  };

  const columns = [
    { key: "name", label: "Имя", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "eventDate",
      label: "Дата мероприятия",
      sortable: true,
      render: (item: Client) => item.eventDate || "Не указана",
    },
    {
      key: "questionnaireCompleted",
      label: "Анкета",
      sortable: true,
      render: (item: Client) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.questionnaireCompleted
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
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
      render: (item: Client) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.subscriptionActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          )}
        >
          {item.subscriptionActive ? "Активна" : "Нет"}
        </span>
      ),
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
      />
    </div>
  );
}

