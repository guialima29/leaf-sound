"use client";

import { FileText, Folder, MoveRight, Pencil, Star, Trash2 } from "lucide-react";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { Section, WorkspaceNote } from "@/types/workspace";

interface NoteContextMenuContentProps {
  note: WorkspaceNote;
  sections: Section[];
  onOpen: (noteId: string) => void;
  onRename: (note: WorkspaceNote) => void;
  onToggleFavorite: (noteId: string) => void;
  /** sectionId === null move a nota para a raiz (sem seção). */
  onMove: (noteId: string, sectionId: string | null) => void;
  onDelete: (note: WorkspaceNote) => void;
}

/**
 * Conteúdo do menu de contexto de uma nota (Abrir, Renomear, Favoritar,
 * Mover, Excluir). Usado nas notas das seções, da raiz e dos favoritos.
 */
export function NoteContextMenuContent({
  note,
  sections,
  onOpen,
  onRename,
  onToggleFavorite,
  onMove,
  onDelete,
}: NoteContextMenuContentProps) {
  // Destinos do "Mover": a raiz (se a nota não está nela) + todas as seções, exceto a atual
  const canMoveToRoot = !!note.sectionId;
  const targetSections = sections.filter((s) => s.id !== note.sectionId);
  const hasMoveTargets = canMoveToRoot || targetSections.length > 0;

  return (
    <ContextMenuContent className="w-48">
      <ContextMenuItem onClick={() => onOpen(note.id)}>
        <FileText className="size-4 mr-2" />
        <span>Abrir Nota</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onRename(note)}>
        <Pencil className="size-4 mr-2" />
        <span>Renomear</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onToggleFavorite(note.id)}>
        <Star className={`size-4 mr-2 ${note.isFavorite ? "fill-primary text-primary" : ""}`} />
        <span>{note.isFavorite ? "Remover dos favoritos" : "Favoritar"}</span>
      </ContextMenuItem>

      {hasMoveTargets && (
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <MoveRight className="size-4 mr-2" />
            <span>Mover para...</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            {canMoveToRoot && (
              <ContextMenuItem onClick={() => onMove(note.id, null)}>
                <span>Raiz (Sem seção)</span>
              </ContextMenuItem>
            )}
            {canMoveToRoot && targetSections.length > 0 && <ContextMenuSeparator />}
            {targetSections.map((s) => (
              <ContextMenuItem key={s.id} onClick={() => onMove(note.id, s.id)}>
                <Folder className="size-3.5 mr-2 text-amber-500" />
                <span className="truncate">{s.name}</span>
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )}

      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => onDelete(note)}
        className="text-red-600 focus:text-red-600"
      >
        <Trash2 className="size-4 mr-2" />
        <span>Excluir</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
