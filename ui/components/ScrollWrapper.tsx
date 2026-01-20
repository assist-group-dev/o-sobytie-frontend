"use client";

import { ScrollArea } from "./ScrollArea";

export function ScrollWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="h-screen w-full">
      <div className="min-h-screen">
        {children}
      </div>
    </ScrollArea>
  );
}

