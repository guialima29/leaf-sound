"use client";

import React, { useState } from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/workspace-context";
import { SectionCreateDialog } from "@/components/SectionCreateDialog";

export function SidebarQuickActions() {
  const router = useRouter();
  const { createNote, createSection, activeWorkspace } = useWorkspace();
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const handleCreateNote = async () => {
    if (!activeWorkspace || isCreatingNote) return;
    try {
      setIsCreatingNote(true);
      const newNote = await createNote("Nova Nota");
      router.push(`/editor?id=${newNote.id}`);
    } catch (err) {
      console.error("Erro ao criar nova nota rápida:", err);
    } finally {
      setIsCreatingNote(false);
    }
  };

  const handleCreateSection = async (name: string) => {
    if (!activeWorkspace) return;
    await createSection(name);
  };

  if (!activeWorkspace) return null;

  return (
    <>
      <div className="px-2 py-1.5 flex items-center gap-1.5 border-t border-sidebar-border bg-sidebar-background">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCreateNote}
          disabled={isCreatingNote}
          className="flex-1 h-8 text-xs font-medium gap-1.5 justify-center shadow-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title="Criar nova nota na raiz da workspace"
        >
          <FilePlus className="size-3.5 text-primary" />
          <span>+ Nota</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsSectionDialogOpen(true)}
          className="flex-1 h-8 text-xs font-medium gap-1.5 justify-center shadow-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title="Criar nova seção de notas"
        >
          <FolderPlus className="size-3.5 text-primary" />
          <span>+ Seção</span>
        </Button>
      </div>

      <SectionCreateDialog
        isOpen={isSectionDialogOpen}
        onClose={() => setIsSectionDialogOpen(false)}
        onSubmit={handleCreateSection}
      />
    </>
  );
}

