"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui/components/Card";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

interface Counterparty {
  id: string;
  name: string;
  type: string;
  inn: string;
  contact: string;
  status: string;
}

const mockCounterparties: Counterparty[] = [
  {
    id: "1",
    name: "ООО Ромашка",
    type: "Поставщик",
    inn: "1234567890",
    contact: "contact@romashka.ru",
    status: "Активен",
  },
  {
    id: "2",
    name: "ИП Сидоров А.В.",
    type: "Подрядчик",
    inn: "0987654321",
    contact: "+7 (999) 111-22-33",
    status: "Активен",
  },
  {
    id: "3",
    name: "ООО Луч",
    type: "Партнер",
    inn: "1122334455",
    contact: "info@luch.ru",
    status: "Неактивен",
  },
];

export default function CounterpartiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(
    () => sortData(mockCounterparties, sortKey, sortDirection),
    [sortKey, sortDirection]
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

  const columns = [
    { key: "name", label: "Название", sortable: true },
    { key: "type", label: "Тип", sortable: true },
    { key: "inn", label: "ИНН", sortable: true },
    { key: "contact", label: "Контакты", sortable: true },
    {
      key: "status",
      label: "Статус",
      sortable: true,
      render: (item: Counterparty) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.status === "Активен"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          )}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase mb-2">Контрагенты</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={paginatedData}
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
            totalItems={sortedData.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>
    </div>
  );
}

