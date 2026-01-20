import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная",
  description: "О!СОБЫТИЕ — ваша ежемесячная порция 'Вау!' Надоела рутина? Подари себе коробку с уникальным впечатлением.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
