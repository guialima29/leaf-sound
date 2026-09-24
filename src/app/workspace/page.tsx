"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import PaginationDemo from "@/components/Pagination";
import TitleWithBar from "@/components/TitleWithBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceCreateForm } from "@/components/WorkspaceCreateForm";
import { useWorkspace } from "@/contexts/workspace-context";

export default function WorkspacePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeWorkspace } = useWorkspace();

  return (
    <>
      <SidebarProvider>
        <AppSidebar onCreateWorkspace={() => setIsModalOpen(true)} />
        <main className="flex-1 w-full overflow-y-auto">
          <TitleWithBar title={activeWorkspace?.name ? `Workspace • ${activeWorkspace.name}` : "Meu Workspace"} />
          <div className="flex flex-col justify-center items-center">
            <PaginationDemo />
          </div>
        </main>
      </SidebarProvider>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <WorkspaceCreateForm onClick={() => setIsModalOpen(false)} />
        </div>
      )}
    </>
  );
}