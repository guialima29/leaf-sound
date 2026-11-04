"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
  MoveRight,
  FilePlus,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/workspace-context";
import { Section, WorkspaceNote } from "@/types/workspace";
import { SectionCreateDialog } from "@/components/SectionCreateDialog";
import { SectionDeleteDialog } from "@/components/SectionDeleteDialog";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export function NavWorkspaceTree() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get("noteId") || searchParams.get("id");

  const {
    activeWorkspace,
    sections,
    notes,
    createNote,
    renameNote,
    deleteNote,
    renameSection,
    deleteSection,
    moveNoteToSection,
  } = useWorkspace();

  // Estados de arrasto (Drag and Drop)
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);
  const [isDragOverRoot, setIsDragOverRoot] = useState(false);

  // Estados de modais e ações
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [editingNote, setEditingNote] = useState<WorkspaceNote | null>(null);
  const [noteNewTitle, setNoteNewTitle] = useState("");
  const [deletingNote, setDeletingNote] = useState<WorkspaceNote | null>(null);

  // Notas da raiz (sem seção)
  const rootNotes = notes.filter((n) => !n.sectionId);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData("text/plain", noteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropOnSection = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);
    const noteId = e.dataTransfer.getData("text/plain");
    if (noteId) {
      moveNoteToSection(noteId, sectionId);
    }
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverRoot(false);
    const noteId = e.dataTransfer.getData("text/plain");
    if (noteId) {
      moveNoteToSection(noteId, null);
    }
  };

  // Abre nota no editor
  const handleOpenNote = (noteId: string) => {
    router.push(`/workspace?noteId=${noteId}`, { scroll: false });
  };

  // Criar nota dentro de uma seção
  const handleCreateNoteInSection = async (sectionId: string) => {
    const newNote = await createNote("Nova Nota", sectionId);
    router.push(`/workspace?noteId=${newNote.id}`, { scroll: false });
  };

  // Submissão do renomear nota
  const handleRenameNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote && noteNewTitle.trim()) {
      await renameNote(editingNote.id, noteNewTitle.trim());
      setEditingNote(null);
    }
  };

  if (!activeWorkspace) {
    return null;
  }

  return (
    <>
      <SidebarGroup className="py-0">
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 p-0 h-auto">
            {activeWorkspace.name} • Notas
          </SidebarGroupLabel>
        </div>

        <SidebarMenu className="gap-1 mt-1">
          {/* SEÇÕES (Profundidade 1 - sem seções aninhadas) */}
          {sections.map((section) => {
            const sectionNotes = notes.filter((n) => n.sectionId === section.id);
            const isDragTarget = dragOverSectionId === section.id;

            return (
              <Collapsible
                key={section.id}
                defaultOpen={true}
                className="group/collapsible"
              >
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <SidebarMenuItem
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        setDragOverSectionId(section.id);
                      }}
                      onDragLeave={() => setDragOverSectionId(null)}
                      onDrop={(e) => handleDropOnSection(e, section.id)}
                      className={`rounded-md transition-colors ${
                        isDragTarget ? "bg-sidebar-accent border-2 border-primary/60" : ""
                      }`}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={section.name}
                          className="font-medium text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground" />
                            <Folder className="size-4 shrink-0 text-amber-500 group-data-[state=open]/collapsible:hidden" />
                            <FolderOpen className="size-4 shrink-0 text-amber-500 hidden group-data-[state=open]/collapsible:block" />
                            <span className="truncate">{section.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground bg-sidebar-accent/80 px-1.5 py-0.5 rounded-full">
                            {sectionNotes.length}
                          </span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="mr-0 pr-0 ml-3.5 pl-2 border-l border-sidebar-border">
                          {sectionNotes.length === 0 ? (
                            <div className="py-1 px-2 text-xs text-muted-foreground italic select-none">
                              Nenhuma nota nesta seção. Arraste ou crie aqui.
                            </div>
                          ) : (
                            sectionNotes.map((note) => (
                              <ContextMenu key={note.id}>
                                <ContextMenuTrigger asChild>
                                  <SidebarMenuSubItem
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, note.id)}
                                    className="cursor-grab active:cursor-grabbing"
                                  >
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={currentNoteId === note.id}
                                      onClick={() => handleOpenNote(note.id)}
                                      className="flex items-center gap-2"
                                    >
                                      <button type="button" className="w-full text-left truncate flex items-center gap-2">
                                        <FileText className="size-3.5 text-muted-foreground shrink-0" />
                                        <span className="truncate">{note.title}</span>
                                      </button>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                </ContextMenuTrigger>

                                {/* MENU DE CONTEXTO DA NOTA */}
                                <ContextMenuContent className="w-48">
                                  <ContextMenuItem onClick={() => handleOpenNote(note.id)}>
                                    <FileText className="size-4 mr-2" />
                                    <span>Abrir Nota</span>
                                  </ContextMenuItem>
                                  <ContextMenuItem
                                    onClick={() => {
                                      setEditingNote(note);
                                      setNoteNewTitle(note.title);
                                    }}
                                  >
                                    <Pencil className="size-4 mr-2" />
                                    <span>Renomear</span>
                                  </ContextMenuItem>

                                  <ContextMenuSub>
                                    <ContextMenuSubTrigger>
                                      <MoveRight className="size-4 mr-2" />
                                      <span>Mover para...</span>
                                    </ContextMenuSubTrigger>
                                    <ContextMenuSubContent className="w-44">
                                      <ContextMenuItem onClick={() => moveNoteToSection(note.id, null)}>
                                        <span>Raiz (Sem seção)</span>
                                      </ContextMenuItem>
                                      <ContextMenuSeparator />
                                      {sections
                                        .filter((s) => s.id !== section.id)
                                        .map((s) => (
                                          <ContextMenuItem
                                            key={s.id}
                                            onClick={() => moveNoteToSection(note.id, s.id)}
                                          >
                                            <Folder className="size-3.5 mr-2 text-amber-500" />
                                            <span className="truncate">{s.name}</span>
                                          </ContextMenuItem>
                                        ))}
                                    </ContextMenuSubContent>
                                  </ContextMenuSub>

                                  <ContextMenuSeparator />
                                  <ContextMenuItem
                                    onClick={() => setDeletingNote(note)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="size-4 mr-2" />
                                    <span>Excluir</span>
                                  </ContextMenuItem>
                                </ContextMenuContent>
                              </ContextMenu>
                            ))
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </ContextMenuTrigger>

                  {/* MENU DE CONTEXTO DA SEÇÃO */}
                  <ContextMenuContent className="w-52">
                    <ContextMenuItem onClick={() => handleCreateNoteInSection(section.id)}>
                      <FilePlus className="size-4 mr-2 text-primary" />
                      <span>Nova Nota nesta Seção</span>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => setEditingSection(section)}>
                      <Pencil className="size-4 mr-2" />
                      <span>Renomear Seção</span>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => setDeletingSection(section)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="size-4 mr-2" />
                      <span>Excluir Seção</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </Collapsible>
            );
          })}

          {/* NOTAS NA RAIZ (ÁREA DROPPABLE PARA ARRASTAR PARA FORA DA SEÇÃO) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setIsDragOverRoot(true);
            }}
            onDragLeave={() => setIsDragOverRoot(false)}
            onDrop={handleDropOnRoot}
            className={`mt-2 rounded-md transition-colors ${
              isDragOverRoot ? "bg-sidebar-accent border-2 border-dashed border-primary/60 p-1" : ""
            }`}
          >
            <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              <span>Notas Gerais</span>
              <span className="text-[10px] text-muted-foreground">{rootNotes.length}</span>
            </div>

            {rootNotes.length === 0 ? (
              <div className="py-2 px-2 text-xs text-muted-foreground/80 italic text-center">
                Arraste notas aqui para deixá-las na raiz.
              </div>
            ) : (
              rootNotes.map((note) => (
                <ContextMenu key={note.id}>
                  <ContextMenuTrigger asChild>
                    <SidebarMenuItem
                      draggable
                      onDragStart={(e) => handleDragStart(e, note.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={currentNoteId === note.id}
                        onClick={() => handleOpenNote(note.id)}
                        className="flex items-center gap-2 hover:bg-sidebar-accent rounded-md"
                      >
                        <button type="button" className="w-full text-left truncate flex items-center gap-2">
                          <FileText className="size-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{note.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </ContextMenuTrigger>

                  {/* MENU DE CONTEXTO DA NOTA NA RAIZ */}
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => handleOpenNote(note.id)}>
                      <FileText className="size-4 mr-2" />
                      <span>Abrir Nota</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        setEditingNote(note);
                        setNoteNewTitle(note.title);
                      }}
                    >
                      <Pencil className="size-4 mr-2" />
                      <span>Renomear</span>
                    </ContextMenuItem>

                    {sections.length > 0 && (
                      <ContextMenuSub>
                        <ContextMenuSubTrigger>
                          <MoveRight className="size-4 mr-2" />
                          <span>Mover para Seção</span>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-44">
                          {sections.map((s) => (
                            <ContextMenuItem
                              key={s.id}
                              onClick={() => moveNoteToSection(note.id, s.id)}
                            >
                              <Folder className="size-3.5 mr-2 text-amber-500" />
                              <span className="truncate">{s.name}</span>
                            </ContextMenuItem>
                          ))}
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                    )}

                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => setDeletingNote(note)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="size-4 mr-2" />
                      <span>Excluir</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            )}
          </div>
        </SidebarMenu>
      </SidebarGroup>

      {/* DIÁLOGO: RENOMEAR SEÇÃO */}
      <SectionCreateDialog
        key={editingSection?.id ?? "closed"}
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        initialName={editingSection?.name || ""}
        isEditing={true}
        onSubmit={async (newName) => {
          if (editingSection) {
            await renameSection(editingSection.id, newName);
          }
        }}
      />

      {/* DIÁLOGO: EXCLUIR SEÇÃO COM ESCOLHA DE MOVER PARA RAIZ OU APAGAR NOTAS */}
      <SectionDeleteDialog
        isOpen={!!deletingSection}
        section={deletingSection}
        notesCount={deletingSection ? notes.filter((n) => n.sectionId === deletingSection.id).length : 0}
        onClose={() => setDeletingSection(null)}
        onConfirm={async (moveNotesToRoot) => {
          if (deletingSection) {
            await deleteSection(deletingSection.id, moveNotesToRoot);
          }
        }}
      />

      {/* DIÁLOGO: RENOMEAR NOTA */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renomear Nota</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameNoteSubmit} className="space-y-4">
            <Input
              value={noteNewTitle}
              onChange={(e) => setNoteNewTitle(e.target.value)}
              placeholder="Novo título da nota"
              autoFocus
              maxLength={40}
              required
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingNote(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!noteNewTitle.trim()}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: EXCLUIR NOTA */}
      <ConfirmDeleteDialog
        isOpen={!!deletingNote}
        title={`Excluir Nota "${deletingNote?.title}"?`}
        description="Esta ação removerá a nota permanentemente desta workspace."
        onClose={() => setDeletingNote(null)}
        onConfirm={async () => {
          if (deletingNote) {
            await deleteNote(deletingNote.id);
            if (currentNoteId === deletingNote.id) {
              router.push("/workspace", { scroll: false });
            }
          }
        }}
      />
    </>
  );
}

