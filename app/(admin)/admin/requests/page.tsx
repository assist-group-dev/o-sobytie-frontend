"use client";

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { RequestDetailModal } from "@/app/(admin)/components/RequestDetailModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

type RequestStatus = "Новый" | "Просмотрен" | "Отвечен" | "В работе" | "Решен";

interface Request {
  id: string;
  name: string;
  email: string;
  subject: string;
  contactMethod: string;
  createdAt: string;
  message: string;
  status: RequestStatus;
}

const STATUS_OPTIONS: RequestStatus[] = ["Новый", "Просмотрен", "Отвечен", "В работе", "Решен"];

import requestsData from "@/app/(admin)/data/requests.json";

const mockRequests: Request[] = (requestsData as Request[]).map((request) => ({
  ...request,
  status: (request.status || "Новый") as RequestStatus,
}));

const contactMethodNames: Record<string, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  email: "Email",
};

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case "Новый":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "Просмотрен":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "Отвечен":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "В работе":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "Решен":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export default function RequestsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null);

  const sortedData = useMemo(
    () => sortData(requests, sortKey, sortDirection),
    [requests, sortKey, sortDirection]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, sortedData]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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

  const handleView = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    setRequests(
      requests.map((item) =>
        item.id === requestId ? { ...item, status: newStatus } : item
      )
    );
    addToast({
      type: "success",
      message: "Статус обращения обновлен",
    });
  };

  const handleDeleteClick = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setRequestToDelete(request);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (requestToDelete) {
      const deletedSubject = requestToDelete.subject;
      setRequests(requests.filter((item) => item.id !== requestToDelete.id));
      setRequestToDelete(null);
      setIsDetailModalOpen(false);
      addToast({
        type: "success",
        message: `Обращение "${deletedSubject}" успешно удалено`,
      });
    }
  };

  const formatDate = (dateString: string) => {
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
    { key: "email", label: "Почта", sortable: true },
    { key: "subject", label: "Тема", sortable: true },
    {
      key: "contactMethod",
      label: "Способ связи",
      sortable: true,
      render: (item: Request) => (
        <span className="font-medium">
          {contactMethodNames[item.contactMethod] || item.contactMethod}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Время создания",
      sortable: true,
      render: (item: Request) => formatDate(item.createdAt),
    },
    {
      key: "status",
      label: "Статус",
      sortable: true,
      render: (item: Request) => (
        <span className={cn("px-2 py-1 text-xs rounded inline-block", getStatusColor(item.status))}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: Request) => (
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase mb-2">Обращения</h1>
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

      <RequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        request={selectedRequest}
        onStatusChange={(requestId, newStatus) => {
          handleStatusChange(requestId, newStatus);
          if (selectedRequest) {
            setSelectedRequest({ ...selectedRequest, status: newStatus });
          }
        }}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setRequestToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить обращение "${requestToDelete?.subject}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />
    </div>
  );
}

