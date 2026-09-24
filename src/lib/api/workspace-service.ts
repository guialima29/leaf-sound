import { Workspace, Section, WorkspaceNote } from "@/types/workspace";
import { apiClient } from "./client";

const WORKSPACES_STORAGE_KEY = "leaf-sound-workspaces";
const SECTIONS_STORAGE_KEY = "leaf-sound-sections";
const NOTES_STORAGE_KEY = "leaf-sound-notes";
const ACTIVE_WORKSPACE_KEY = "leaf-sound-active-workspace-id";

// Inicializa dados padrão e migra notas legadas se necessário
function initializeLocalStorage(): void {
  if (typeof window === "undefined") return;

  let workspaces: Workspace[] = [];
  try {
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    workspaces = raw ? JSON.parse(raw) : [];
  } catch {
    workspaces = [];
  }

  // Se não houver nenhuma workspace, cria uma padrão
  if (workspaces.length === 0) {
    const defaultWorkspace: Workspace = {
      id: "default-workspace",
      name: "Principal",
      description: "Meu workspace principal de estudos",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    workspaces = [defaultWorkspace];
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, defaultWorkspace.id);
  }

  // Migra notas existentes para a workspace padrão se não tiverem workspaceId
  try {
    const notesRaw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (notesRaw) {
      const notes = JSON.parse(notesRaw);
      let modified = false;
      const defaultWorkspaceId = workspaces[0].id;

      const migratedNotes = notes.map((n: Record<string, unknown>) => {
        if (!n.workspaceId) {
          modified = true;
          return {
            ...n,
            workspaceId: defaultWorkspaceId,
            sectionId: n.sectionId || null,
          };
        }
        return n;
      });

      if (modified) {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(migratedNotes));
      }
    }
  } catch (err) {
    console.warn("Erro ao migrar notas legadas:", err);
  }
}

export const workspaceService = {
  // WORKSPACES
  async getWorkspaces(): Promise<Workspace[]> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<Workspace[]>("/api/workspaces");
      } catch (err) {
        console.warn("Falha ao buscar workspaces da API remota, usando cache local:", err);
      }
    }

    if (typeof window === "undefined") return [];
    initializeLocalStorage();
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async createWorkspace(name: string, description?: string): Promise<Workspace> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        const created = await apiClient<Workspace>("/api/workspaces", {
          method: "POST",
          body: JSON.stringify({ name, description }),
        });
        // Atualiza cache local
        if (typeof window !== "undefined") {
          const list = await this.getWorkspaces();
          localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify([created, ...list]));
        }
        return created;
      } catch (err) {
        console.warn("Falha ao criar workspace na API, usando local:", err);
      }
    }

    const now = Date.now();
    const newWs: Workspace = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
    };

    if (typeof window !== "undefined") {
      const list = await this.getWorkspaces();
      const updated = [newWs, ...list];
      localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(updated));
    }

    return newWs;
  },

  async deleteWorkspace(id: string): Promise<void> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        await apiClient(`/api/workspaces/${id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Falha ao deletar workspace na API:", err);
      }
    }

    if (typeof window !== "undefined") {
      const list = await this.getWorkspaces();
      const filtered = list.filter((w) => w.id !== id);
      localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(filtered));

      // Remove seções e notas associadas
      const sectionsRaw = localStorage.getItem(SECTIONS_STORAGE_KEY);
      if (sectionsRaw) {
        const sections: Section[] = JSON.parse(sectionsRaw);
        localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections.filter((s) => s.workspaceId !== id)));
      }

      const notesRaw = localStorage.getItem(NOTES_STORAGE_KEY);
      if (notesRaw) {
        const notes: WorkspaceNote[] = JSON.parse(notesRaw);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes.filter((n) => n.workspaceId !== id)));
      }
    }
  },

  // SECTIONS (Regra: sem seções aninhadas)
  async getSections(workspaceId: string): Promise<Section[]> {
    if (!workspaceId) return [];

    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<Section[]>(`/api/workspaces/${workspaceId}/sections`);
      } catch (err) {
        console.warn("Falha ao buscar seções da API remota, usando cache local:", err);
      }
    }

    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    const allSections: Section[] = raw ? JSON.parse(raw) : [];
    return allSections
      .filter((s) => s.workspaceId === workspaceId)
      .sort((a, b) => a.order - b.order);
  },

  async createSection(workspaceId: string, name: string): Promise<Section> {
    if (!workspaceId) throw new Error("workspaceId é obrigatório");
    if (!name.trim()) throw new Error("Nome da seção é obrigatório");

    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<Section>(`/api/workspaces/${workspaceId}/sections`, {
          method: "POST",
          body: JSON.stringify({ name }),
        });
      } catch (err) {
        console.warn("Falha ao criar seção na API, usando local:", err);
      }
    }

    const currentSections = await this.getSections(workspaceId);
    const newSection: Section = {
      id: crypto.randomUUID(),
      workspaceId,
      name: name.trim(),
      order: currentSections.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
      const all: Section[] = raw ? JSON.parse(raw) : [];
      all.push(newSection);
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(all));
    }

    return newSection;
  },

  async renameSection(sectionId: string, newName: string): Promise<Section> {
    if (!newName.trim()) throw new Error("Nome da seção não pode ser vazio");

    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<Section>(`/api/sections/${sectionId}`, {
          method: "PATCH",
          body: JSON.stringify({ name: newName.trim() }),
        });
      } catch (err) {
        console.warn("Falha ao renomear seção na API, usando local:", err);
      }
    }

    if (typeof window === "undefined") throw new Error("Window não disponível");
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    const all: Section[] = raw ? JSON.parse(raw) : [];
    const index = all.findIndex((s) => s.id === sectionId);
    if (index === -1) throw new Error("Seção não encontrada");

    all[index] = {
      ...all[index],
      name: newName.trim(),
      updatedAt: Date.now(),
    };

    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(all));
    return all[index];
  },

  async deleteSection(sectionId: string, moveNotesToRoot = true): Promise<void> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        await apiClient(`/api/sections/${sectionId}?moveNotesToRoot=${moveNotesToRoot}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Falha ao deletar seção na API, usando local:", err);
      }
    }

    if (typeof window === "undefined") return;

    // Remove a seção
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    const all: Section[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(all.filter((s) => s.id !== sectionId)));

    // Atualiza notas que estavam nessa seção
    const notesRaw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (notesRaw) {
      const notes: WorkspaceNote[] = JSON.parse(notesRaw);
      const updatedNotes = notes.map((n) => {
        if (n.sectionId === sectionId) {
          return {
            ...n,
            sectionId: moveNotesToRoot ? null : n.sectionId,
          };
        }
        return n;
      });
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(moveNotesToRoot ? updatedNotes : updatedNotes.filter((n) => n.sectionId !== sectionId)));
    }
  },

  // NOTES BY WORKSPACE
  async getNotes(workspaceId: string): Promise<WorkspaceNote[]> {
    if (!workspaceId) return [];

    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<WorkspaceNote[]>(`/api/workspaces/${workspaceId}/notes`);
      } catch (err) {
        console.warn("Falha ao buscar notas da API remota, usando cache local:", err);
      }
    }

    if (typeof window === "undefined") return [];
    initializeLocalStorage();
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const allNotes: WorkspaceNote[] = raw ? JSON.parse(raw) : [];
    return allNotes
      .filter((n) => n.workspaceId === workspaceId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async createNote(workspaceId: string, title: string, sectionId?: string | null): Promise<WorkspaceNote> {
    if (!workspaceId) throw new Error("workspaceId é obrigatório");

    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR");
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<WorkspaceNote>(`/api/workspaces/${workspaceId}/notes`, {
          method: "POST",
          body: JSON.stringify({ title, sectionId: sectionId || null }),
        });
      } catch (err) {
        console.warn("Falha ao criar nota na API, usando local:", err);
      }
    }

    const id = crypto.randomUUID();
    const newNote: WorkspaceNote = {
      id,
      workspaceId,
      sectionId: sectionId || null,
      title: title.trim() || "Sem título",
      description: "",
      content: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastUpdateDate: dateStr,
      lastUpdateTime: timeStr,
      href: `/editor?id=${id}`,
    };

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      const all: WorkspaceNote[] = raw ? JSON.parse(raw) : [];
      all.unshift(newNote);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(all));
    }

    return newNote;
  },

  async renameNote(noteId: string, newTitle: string): Promise<WorkspaceNote> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<WorkspaceNote>(`/api/notes/${noteId}`, {
          method: "PATCH",
          body: JSON.stringify({ title: newTitle }),
        });
      } catch (err) {
        console.warn("Falha ao renomear nota na API, usando local:", err);
      }
    }

    if (typeof window === "undefined") throw new Error("Window indisponível");
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const all: WorkspaceNote[] = raw ? JSON.parse(raw) : [];
    const index = all.findIndex((n) => n.id === noteId);
    if (index === -1) throw new Error("Nota não encontrada");

    const now = new Date();
    all[index] = {
      ...all[index],
      title: newTitle.trim() || all[index].title,
      updatedAt: Date.now(),
      lastUpdateDate: now.toLocaleDateString("pt-BR"),
      lastUpdateTime: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(all));
    return all[index];
  },

  async moveNoteToSection(noteId: string, sectionId: string | null): Promise<WorkspaceNote> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        return await apiClient<WorkspaceNote>(`/api/notes/${noteId}/section`, {
          method: "PATCH",
          body: JSON.stringify({ sectionId }),
        });
      } catch (err) {
        console.warn("Falha ao mover nota na API, usando local:", err);
      }
    }

    if (typeof window === "undefined") throw new Error("Window indisponível");
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const all: WorkspaceNote[] = raw ? JSON.parse(raw) : [];
    const index = all.findIndex((n) => n.id === noteId);
    if (index === -1) throw new Error("Nota não encontrada");

    all[index] = {
      ...all[index],
      sectionId: sectionId || null,
      updatedAt: Date.now(),
    };

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(all));
    return all[index];
  },

  async deleteNote(noteId: string): Promise<void> {
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        await apiClient(`/api/notes/${noteId}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Falha ao deletar nota na API, usando local:", err);
      }
    }

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      const all: WorkspaceNote[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(all.filter((n) => n.id !== noteId)));
    }
  },

  // ACTIVE WORKSPACE PERSISTENCE
  getActiveWorkspaceId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_WORKSPACE_KEY);
  },

  setActiveWorkspaceId(id: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
  },
};

