"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import PaginationDemo from "@/components/Pagination";
import TitleWithBar from "@/components/TitleWithBar";
import { NoteEditor } from "@/components/NoteEditor";
import EmptyNotes from "@/components/EmptyNotes";
import Spinner from "@/components/Spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceCreateForm } from "@/components/WorkspaceCreateForm";
import { useWorkspace } from "@/contexts/workspace-context";

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId") || searchParams.get("id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeWorkspace, notes, createNote } = useWorkspace();

  return (
    <>
      <SidebarProvider>
        <AppSidebar onCreateWorkspace={() => setIsModalOpen(true)} />
        <main className="flex-1 w-full overflow-y-auto">
          {noteId ? (
            <NoteEditor
              noteId={noteId}
              onBack={() => router.push("/workspace", { scroll: false })}
            />
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
              <EmptyNotes
                onCreateNote={async () => {
                  const newNote = await createNote("Nova Nota");
                  router.push(`/workspace?noteId=${newNote.id}`, { scroll: false });
                }}
              />
            </div>
          ) : (
            <>
              <TitleWithBar
                title={
                  activeWorkspace?.name
                    ? `Workspace • ${activeWorkspace.name}`
                    : "Meu Workspace"
                }
              />
              <div className="flex flex-col justify-center items-center">
                <PaginationDemo />
              </div>
            </>
          )}
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

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}