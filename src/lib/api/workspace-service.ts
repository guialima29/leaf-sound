import { Workspace, Section, WorkspaceNote } from "@/types/workspace";
import { apiAdapter } from "./adapters/api-adapter";
import { localAdapter, ACTIVE_WORKSPACE_KEY } from "./adapters/local-adapter";
import type { NoteUpdate, WorkspaceAdapter } from "./adapters/types";

export type { NoteUpdate } from "./adapters/types";

// Um modo por ambiente, escolhido na inicialização (NEXT_PUBLIC_API_URL é embutida no build):
// com a variável, só a API; sem ela, só o localStorage. Não existe fallback entre os dois.
export const isApiMode = Boolean(process.env.NEXT_PUBLIC_API_URL);
const adapter: WorkspaceAdapter = isApiMode ? apiAdapter : localAdapter;

// O service concentra validação e normalização; a persistência fica nos adapters.
export const workspaceService = {
  // WORKSPACES
  getWorkspaces(): Promise<Workspace[]> {
    return adapter.getWorkspaces();
  },

  createWorkspace(name: string, description?: string): Promise<Workspace> {
    return adapter.createWorkspace(name, description);
  },

  deleteWorkspace(id: string): Promise<void> {
    return adapter.deleteWorkspace(id);
  },

  // SECTIONS (Regra: sem seções aninhadas)
  async getSections(workspaceId: string): Promise<Section[]> {
    if (!workspaceId) return [];
    return adapter.getSections(workspaceId);
  },

  async createSection(workspaceId: string, name: string): Promise<Section> {
    if (!workspaceId) throw new Error("workspaceId é obrigatório");
    if (!name.trim()) throw new Error("Nome da seção é obrigatório");
    return adapter.createSection(workspaceId, name.trim());
  },

  async renameSection(sectionId: string, newName: string): Promise<Section> {
    if (!newName.trim()) throw new Error("Nome da seção não pode ser vazio");
    return adapter.renameSection(sectionId, newName.trim());
  },

  deleteSection(sectionId: string, moveNotesToRoot = true): Promise<void> {
    return adapter.deleteSection(sectionId, moveNotesToRoot);
  },

  // NOTES BY WORKSPACE
  // No modo API a listagem pode vir sem `content` (resumos): para o conteúdo completo use getNote.
  async getNotes(workspaceId: string): Promise<WorkspaceNote[]> {
    if (!workspaceId) return [];
    return adapter.getNotes(workspaceId);
  },

  async createNote(workspaceId: string, title: string, sectionId?: string | null): Promise<WorkspaceNote> {
    if (!workspaceId) throw new Error("workspaceId é obrigatório");
    return adapter.createNote(workspaceId, title, sectionId);
  },

  getNote(noteId: string): Promise<WorkspaceNote | undefined> {
    return adapter.getNote(noteId);
  },

  // Atualização parcial de uma nota (título, conteúdo, descrição, favorito).
  // Regra única de título: título vazio/só espaços é ignorado (nunca é gravado em branco).
  // Se o patch ficar vazio, nada é gravado nem enviado e a nota atual é devolvida.
  // Favoritar/desfavoritar não altera updatedAt (nem no local nem no backend).
  async updateNote(noteId: string, patch: NoteUpdate): Promise<WorkspaceNote> {
    const normalized: NoteUpdate = {};
    if (patch.title !== undefined && patch.title.trim()) normalized.title = patch.title.trim();
    if (patch.content !== undefined) normalized.content = patch.content;
    if (patch.description !== undefined) normalized.description = patch.description;
    if (patch.isFavorite !== undefined) normalized.isFavorite = patch.isFavorite;
    return adapter.updateNote(noteId, normalized);
  },

  renameNote(noteId: string, newTitle: string): Promise<WorkspaceNote> {
    return this.updateNote(noteId, { title: newTitle });
  },

  moveNoteToSection(noteId: string, sectionId: string | null): Promise<WorkspaceNote> {
    return adapter.moveNoteToSection(noteId, sectionId);
  },

  deleteNote(noteId: string): Promise<void> {
    return adapter.deleteNote(noteId);
  },

  // ACTIVE WORKSPACE PERSISTENCE (sempre local: é preferência deste navegador)
  getActiveWorkspaceId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_WORKSPACE_KEY);
  },

  setActiveWorkspaceId(id: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
  },
};
