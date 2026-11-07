"use client";

import { WorkspaceProvider } from "@/contexts/workspace-context";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      {children}
      <Toaster position="bottom-right" richColors />
    </WorkspaceProvider>
  );
}
