import { WorkspaceProvider } from "@/contexts/workspace-context";

// O contexto de workspaces/notas só existe sob /workspace: em modo API, carregá-lo em / ou /login
// dispararia GET /api/workspaces para visitantes sem sessão.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
