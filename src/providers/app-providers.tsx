"use client";

import { WorkspaceProvider } from "@/contexts/workspace-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
