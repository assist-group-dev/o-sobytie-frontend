import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ панель",
  description: "Панель администратора",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

