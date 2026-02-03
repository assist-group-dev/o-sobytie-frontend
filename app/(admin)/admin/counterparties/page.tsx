"use client";

import { useState, useMemo } from "react";
import { Eye, Edit, Plus } from "lucide-react";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { Table } from "@/app/(admin)/components/Table";
import { Pagination } from "@/app/(admin)/components/Pagination";
import { CounterpartyDetailModal } from "@/app/(admin)/components/CounterpartyDetailModal";
import { CounterpartyEditModal } from "@/app/(admin)/components/CounterpartyEditModal";
import { CounterpartyCreateModal } from "@/app/(admin)/components/CounterpartyCreateModal";
import { ConfirmModal } from "@/app/(admin)/components/ConfirmModal";
import { useToastStore } from "@/app/(admin)/stores/useToastStore";
import { sortData } from "@/app/(admin)/utils/sortData";

interface Counterparty {
  id: string;
  name: string;
  address: string;
  phone: string;
  contactPerson: string;
  description: string;
}

const mockCounterparties: Counterparty[] = [
  {
    id: "1",
    name: "ООО Ромашка",
    address: "г. Москва, ул. Ленина, д. 10, офис 25",
    phone: "+7 (495) 123-45-67",
    contactPerson: "Иванов Иван Иванович",
    description: "Основной поставщик цветов и декоративных растений. Работаем с 2010 года. Специализируемся на эксклюзивных букетах и оформлении мероприятий.",
  },
  {
    id: "2",
    name: "ИП Сидоров А.В.",
    address: "г. Санкт-Петербург, Невский проспект, д. 28, кв. 15",
    phone: "+7 (812) 234-56-78",
    contactPerson: "Сидоров Алексей Владимирович",
    description: "Подрядчик по организации развлекательных мероприятий. Опыт работы более 5 лет. Проводим мастер-классы, квесты и корпоративные мероприятия.",
  },
  {
    id: "3",
    name: "ООО Луч",
    address: "г. Казань, ул. Баумана, д. 58, офис 7",
    phone: "+7 (843) 345-67-89",
    contactPerson: "Петрова Мария Сергеевна",
    description: "Партнер по предоставлению транспортных услуг. Осуществляем доставку по всей России. Собственный автопарк из 15 единиц техники.",
  },
  {
    id: "4",
    name: "ООО Свет",
    address: "г. Екатеринбург, ул. Ленина, д. 50, офис 12",
    phone: "+7 (343) 456-78-90",
    contactPerson: "Козлова Елена Викторовна",
    description: "Поставщик продуктов питания премиум-класса. Работаем с ресторанами и кейтеринговыми компаниями. Гарантируем качество и свежесть продукции.",
  },
  {
    id: "5",
    name: "ИП Волков Д.С.",
    address: "г. Новосибирск, Красный проспект, д. 20, кв. 33",
    phone: "+7 (383) 567-89-01",
    contactPerson: "Волков Дмитрий Сергеевич",
    description: "Фотограф и видеограф для мероприятий. Специализируюсь на съемке корпоративных событий, дней рождений и свадеб. Опыт более 8 лет.",
  },
];

export default function CounterpartiesPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [counterparties, setCounterparties] = useState<Counterparty[]>(mockCounterparties);
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(
    () => sortData(counterparties, sortKey, sortDirection),
    [counterparties, sortKey, sortDirection]
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

  const handleView = (counterparty: Counterparty) => {
    setSelectedCounterparty(counterparty);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (counterparty: Counterparty) => {
    setSelectedCounterparty(counterparty);
    setIsEditModalOpen(true);
  };

  const handleSave = (data: Partial<Counterparty>) => {
    if (selectedCounterparty) {
      setCounterparties(
        counterparties.map((item) =>
          item.id === selectedCounterparty.id ? { ...item, ...data } : item
        )
      );
      addToast({
        type: "success",
        message: `Контрагент "${selectedCounterparty.name}" успешно отредактирован`,
      });
    }
  };

  const handleCreate = (data: Omit<Counterparty, "id">) => {
    const newCounterparty: Counterparty = {
      ...data,
      id: String(counterparties.length + 1),
    };
    setCounterparties([...counterparties, newCounterparty]);
    addToast({
      type: "success",
      message: `Контрагент "${data.name}" успешно создан`,
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCounterparty) {
      const deletedName = selectedCounterparty.name;
      setCounterparties(counterparties.filter((item) => item.id !== selectedCounterparty.id));
      setSelectedCounterparty(null);
      setIsEditModalOpen(false);
      addToast({
        type: "success",
        message: `Контрагент "${deletedName}" успешно удален`,
      });
    }
  };

  const columns = [
    { key: "name", label: "Название", sortable: true },
    { key: "address", label: "Адрес", sortable: true },
    { key: "phone", label: "Номер телефона", sortable: true },
    { key: "contactPerson", label: "Имя контактного лица", sortable: true },
    {
      key: "actions",
      label: "Действия",
      sortable: false,
      render: (item: Counterparty) => (
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
        <h1 className="text-3xl font-bold uppercase">Контрагенты</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Создать контрагента
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

      <CounterpartyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        counterparty={selectedCounterparty}
      />

      <CounterpartyEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        counterparty={selectedCounterparty}
        onSave={handleSave}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить контрагента "${selectedCounterparty?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />

      <CounterpartyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

