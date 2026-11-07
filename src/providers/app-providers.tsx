"use client";

import { Toaster } from "@/components/ui/sonner";

// Providers globais (toda rota). O WorkspaceProvider NÃO fica aqui: ele carrega workspaces/notas
// (no modo API, chamadas autenticadas) e por isso só envolve a rota /workspace
// (src/app/workspace/layout.tsx); a landing e o login não fazem nenhuma chamada à API.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" richColors />
    </>
  );
}
