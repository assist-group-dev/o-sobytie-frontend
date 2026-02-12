import { API_BASE_URL, BACKEND_URL } from "@/utils/backend";

export interface TariffApiItem {
  id: string;
  name: string;
  months: number;
  discountPercent: number;
  description: string;
  image: string;
  isActive: boolean;
  price: number;
  originalPrice: number;
  pricePerMonth: number;
}

export interface TariffCard {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  priceNumeric: number;
  originalPrice: string | undefined;
  discount: string | undefined;
  image: string;
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function imageUrl(image: string): string {
  if (!image) return "";
  return image.startsWith("http") ? image : `${BACKEND_URL}${image}`;
}

export function mapTariffApiToCard(item: TariffApiItem): TariffCard {
  return {
    id: item.id,
    title: item.name,
    description: item.description ?? "",
    fullDescription: item.description ?? "",
    price: formatPrice(item.price),
    priceNumeric: item.price,
    originalPrice:
      item.discountPercent > 0 ? formatPrice(item.originalPrice) : undefined,
    discount:
      item.discountPercent > 0 ? `Экономия ${item.discountPercent}%` : undefined,
    image: imageUrl(item.image),
  };
}

export async function fetchTariffs(): Promise<TariffCard[]> {
  const response = await fetch(`${API_BASE_URL}/tariffs`);
  if (!response.ok) return [];
  const data = (await response.json()) as TariffApiItem[];
  const items = Array.isArray(data) ? data : [];
  return items.filter((t) => t.isActive).map(mapTariffApiToCard);
}
