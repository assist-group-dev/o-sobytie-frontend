"use client";

import { ScrollArea } from "./ScrollArea";

export function PageScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="fixed inset-0">
      {children}
    </ScrollArea>
  );
}






