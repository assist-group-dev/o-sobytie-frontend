"use client";

import { useEffect } from "react";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void import("@/utils/i18n");
  }, []);

  return <>{children}</>;
}
