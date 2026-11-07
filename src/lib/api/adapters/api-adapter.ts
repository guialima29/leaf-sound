import type { Workspace, Section, WorkspaceNote } from "@/types/workspace";
import { apiClient, ApiError } from "../client";
import type { NoteUpdate, WorkspaceAdapter } from "./types";

// Última versão conhecida de cada nota (respostas da API). Serve para devolver a nota atual
// quando um patch fica vazio e não há nada para enviar (sem chamada de rede).
const noteCache = new Map<string, WorkspaceNote>();

// Chave do último conteúdo enviado com sucesso por nota: evita reenviar o mesmo conteúdo
// (ex.: salvamento do autosave + salvamento ao trocar de nota com o mesmo texto pendente).
const lastSentContent = new Map<string, string>();

// Fila por nota (PATCH e GET): um PATCH só começa depois que o anterior da mesma nota terminou,
// então nunca há dois em paralelo nem chegada fora de ordem.
const patchQueues = new Map<string, Promise<unknown>>();

// Executa `job` depois de tudo o que já está na fila da nota (mesmo que tenha falhado).
function enqueue<T>(noteId: string, job: () => Promise<T>): Promise<T> {
  const previous = patchQueues.get(noteId) ?? Promise.resolve();
  const result = previous.then(job, job);
  const tail = result.catch(() => undefined);
  patchQueues.set(noteId, tail);
  void tail.then(() => {
    if (patchQueues.get(noteId) === tail) patchQueues.delete(noteId);
  });
  return result;
}

function remember(note: WorkspaceNote): void {
  noteCache.set(note.id, { ...noteCache.get(note.id), ...note });
}

function forget(noteId: string): void {
  noteCache.delete(noteId);
  lastSentContent.delete(noteId);
}

// Compara só os blocos: o OutputData do Editor.js traz `time`, que muda a cada save().
function contentKey(patch: NoteUpdate): string | undefined {
  if (patch.content === undefined) return undefined;
  return JSON.stringify([patch.content.blocks, patch.description ?? null]);
}

async function patchNote(noteId: string, patch: NoteUpdate): Promise<WorkspaceNote> {
  const body: NoteUpdate = { ...patch };
  const key = contentKey(patch);
  if (key !== undefined && lastSentContent.get(noteId) === key) {
    delete body.content;
    delete body.description;
  }

  if (Object.keys(body).length === 0) {
    const cached = noteCache.get(noteId);
    if (cached) return cached;
    throw new Error("Nota não encontrada");
  }

  const updated = await apiClient<WorkspaceNote>(`/api/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (key !== undefined) lastSentContent.set(noteId, key);
  remember({ ...updated, id: noteId });
  return updated;
}

// Modo API: tudo vai para o backend Go. Erros sobem como exceção (ApiError ou TypeError de
// rede); nada é gravado no localStorage como "plano B".
export const apiAdapter: WorkspaceAdapter = {
  // WORKSPACES
  async getWorkspaces(): Promise<Workspace[]> {
    return apiClient<Workspace[]>("/api/workspaces");
  },

  async createWorkspace(name: string, description?: string): Promise<Workspace> {
    return apiClient<Workspace>("/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  },

  async deleteWorkspace(id: string): Promise<void> {
    await apiClient(`/api/workspaces/${id}`, { method: "DELETE" });
  },

  // SECTIONS
  async getSections(workspaceId: string): Promise<Section[]> {
    return apiClient<Section[]>(`/api/workspaces/${workspaceId}/sections`);
  },

  async createSection(workspaceId: string, name: string): Promise<Section> {
    return apiClient<Section>(`/api/workspaces/${workspaceId}/sections`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async renameSection(sectionId: string, newName: string): Promise<Section> {
    return apiClient<Section>(`/api/sections/${sectionId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: newName.trim() }),
    });
  },

  async deleteSection(sectionId: string, moveNotesToRoot: boolean): Promise<void> {
    await apiClient(`/api/sections/${sectionId}?moveNotesToRoot=${moveNotesToRoot}`, {
      method: "DELETE",
    });
    // Mantém o cache coerente com o servidor: um salvamento descartado por ser igual ao anterior
    // devolve a nota do cache, e um sectionId antigo ali faria a nota sumir da sidebar.
    for (const [id, note] of [...noteCache]) {
      if (note.sectionId !== sectionId) continue;
      if (moveNotesToRoot) noteCache.set(id, { ...note, sectionId: null });
      else forget(id);
    }
  },

  // NOTES
  // A listagem pode devolver resumos (sem `content`); o conteúdo completo vem de getNote.
  async getNotes(workspaceId: string): Promise<WorkspaceNote[]> {
    const notes = await apiClient<WorkspaceNote[]>(`/api/workspaces/${workspaceId}/notes`);
    notes.forEach(remember);
    return notes;
  },

  // 404 = nota não existe (undefined); qualquer outro erro sobe.
  // Entra na mesma fila dos PATCH da nota: o GET só sai depois dos PATCH pendentes terminarem
  // (senão devolveria o conteúdo antigo, ex.: voltar para a nota enquanto o salvamento ao sair
  // dela ainda está em andamento) e os PATCH seguintes esperam por ele.
  getNote(noteId: string): Promise<WorkspaceNote | undefined> {
    return enqueue(noteId, async () => {
      try {
        const note = await apiClient<WorkspaceNote>(`/api/notes/${noteId}`);
        // Nova leitura do servidor: o próximo salvamento não deve ser descartado como "igual".
        // Como o GET está na fila, nenhum PATCH roda em paralelo com este reset.
        lastSentContent.delete(noteId);
        remember(note);
        return note;
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    });
  },

  async createNote(workspaceId: string, title: string, sectionId?: string | null): Promise<WorkspaceNote> {
    const created = await apiClient<WorkspaceNote>(`/api/workspaces/${workspaceId}/notes`, {
      method: "POST",
      body: JSON.stringify({ title, sectionId: sectionId || null }),
    });
    remember(created);
    return created;
  },

  updateNote(noteId: string, patch: NoteUpdate): Promise<WorkspaceNote> {
    return enqueue(noteId, () => patchNote(noteId, patch));
  },

  async moveNoteToSection(noteId: string, sectionId: string | null): Promise<WorkspaceNote> {
    const moved = await apiClient<WorkspaceNote>(`/api/notes/${noteId}/section`, {
      method: "PATCH",
      body: JSON.stringify({ sectionId }),
    });
    remember({ ...moved, id: noteId });
    return moved;
  },

  async deleteNote(noteId: string): Promise<void> {
    await apiClient(`/api/notes/${noteId}`, { method: "DELETE" });
    forget(noteId);
  },
};
