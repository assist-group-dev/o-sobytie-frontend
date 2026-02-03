"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui/components/Card";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  client: string;
  event: string;
  status: string;
}

const mockSchedule: ScheduleItem[] = [
  {
    id: "1",
    date: "2024-03-15",
    time: "10:00",
    client: "Иван Иванов",
    event: "Доставка коробки",
    status: "Запланировано",
  },
  {
    id: "2",
    date: "2024-03-15",
    time: "14:00",
    client: "Мария Петрова",
    event: "Доставка коробки",
    status: "В процессе",
  },
  {
    id: "3",
    date: "2024-03-16",
    time: "11:00",
    client: "Алексей Сидоров",
    event: "Доставка коробки",
    status: "Запланировано",
  },
];

export default function SchedulePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(
    () => sortData(mockSchedule, sortKey, sortDirection),
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
    { key: "date", label: "Дата", sortable: true },
    { key: "time", label: "Время", sortable: true },
    { key: "client", label: "Клиент", sortable: true },
    { key: "event", label: "Событие", sortable: true },
    {
      key: "status",
      label: "Статус",
      sortable: true,
      render: (item: ScheduleItem) => (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded",
            item.status === "Запланировано"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : item.status === "В процессе"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
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
        <h1 className="text-3xl font-bold uppercase mb-2">Расписание</h1>
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

