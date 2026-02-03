"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui/components/Card";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { sortData } from "@/app/(admin)/utils/sortData";
import { cn } from "@/utils/cn";

interface Promocode {
  id: string;
  code: string;
  discount: string;
  validFrom: string;
  validTo: string;
  uses: string;
  status: string;
}

const mockPromocodes: Promocode[] = [
  {
    id: "1",
    code: "WELCOME10",
    discount: "10%",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    uses: "15/100",
    status: "Активен",
  },
  {
    id: "2",
    code: "SPRING20",
    discount: "20%",
    validFrom: "2024-03-01",
    validTo: "2024-03-31",
    uses: "45/50",
    status: "Активен",
  },
  {
    id: "3",
    code: "OLD2023",
    discount: "15%",
    validFrom: "2023-01-01",
    validTo: "2023-12-31",
    uses: "100/100",
    status: "Истек",
  },
];

export default function PromocodesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(
    () => sortData(mockPromocodes, sortKey, sortDirection),
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
    { key: "code", label: "Код", sortable: true },
    { key: "discount", label: "Скидка", sortable: true },
    { key: "validFrom", label: "Действует с", sortable: true },
    { key: "validTo", label: "Действует до", sortable: true },
    { key: "uses", label: "Использований", sortable: true },
    {
      key: "status",
      label: "Статус",
      sortable: true,
      render: (item: Promocode) => (
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
        <h1 className="text-3xl font-bold uppercase mb-2">Промокоды</h1>
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

