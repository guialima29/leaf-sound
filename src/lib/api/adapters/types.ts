import type { Workspace, Section, WorkspaceNote } from "@/types/workspace";

// Campos que podem ser alterados em PATCH /api/notes/:id
export type NoteUpdate = Partial<Pick<WorkspaceNote, "title" | "content" | "description" | "isFavorite">>;

// Interface comum dos dois modos de armazenamento. O workspaceService escolhe UM adapter
// na inicialização (API quando NEXT_PUBLIC_API_URL existe, localStorage caso contrário).
// Não há fallback entre eles: erro da API sobe como exceção.
export interface WorkspaceAdapter {
  getWorkspaces(): Promise<Workspace[]>;
  createWorkspace(name: string, description?: string): Promise<Workspace>;
  deleteWorkspace(id: string): Promise<void>;

  getSections(workspaceId: string): Promise<Section[]>;
  createSection(workspaceId: string, name: string): Promise<Section>;
  renameSection(sectionId: string, newName: string): Promise<Section>;
  deleteSection(sectionId: string, moveNotesToRoot: boolean): Promise<void>;

  getNotes(workspaceId: string): Promise<WorkspaceNote[]>;
  getNote(noteId: string): Promise<WorkspaceNote | undefined>;
  createNote(workspaceId: string, title: string, sectionId?: string | null): Promise<WorkspaceNote>;
  // `patch` já chega normalizado (título sem espaços nas pontas e nunca vazio)
  updateNote(noteId: string, patch: NoteUpdate): Promise<WorkspaceNote>;
  moveNoteToSection(noteId: string, sectionId: string | null): Promise<WorkspaceNote>;
  deleteNote(noteId: string): Promise<void>;
}
