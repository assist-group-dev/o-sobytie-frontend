"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui/components/Card";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

interface Tariff {
  id: string;
  name: string;
  duration: string;
  price: string;
  discount: string;
  status: string;
}

const mockTariffs: Tariff[] = [
  {
    id: "1",
    name: "1 месяц",
    duration: "1 месяц",
    price: "2 990 ₽",
    discount: "0%",
    status: "Активен",
  },
  {
    id: "2",
    name: "3 месяца",
    duration: "3 месяца",
    price: "8 073 ₽",
    discount: "10%",
    status: "Активен",
  },
  {
    id: "3",
    name: "6 месяцев",
    duration: "6 месяцев",
    price: "14 352 ₽",
    discount: "20%",
    status: "Активен",
  },
];

export default function TariffsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(
    () => sortData(mockTariffs, sortKey, sortDirection),
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
    { key: "duration", label: "Длительность", sortable: true },
    { key: "price", label: "Цена", sortable: true },
    { key: "discount", label: "Скидка", sortable: true },
    {
      key: "status",
      label: "Статус",
      sortable: true,
      render: (item: Tariff) => (
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
        <h1 className="text-3xl font-bold uppercase mb-2">Тарифы</h1>
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

