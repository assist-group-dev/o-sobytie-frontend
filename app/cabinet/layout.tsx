import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Личный кабинет",
  description: "Личный кабинет пользователя",
};

export default function CabinetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
