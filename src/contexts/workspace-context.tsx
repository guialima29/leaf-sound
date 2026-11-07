"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Workspace, Section, WorkspaceNote } from "@/types/workspace";
import { workspaceService, type NoteUpdate } from "@/lib/api/workspace-service";
import { reportError } from "@/lib/api/errors";

interface WorkspaceContextType {
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  sections: Section[];
  notes: WorkspaceNote[];
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  createSection: (name: string) => Promise<Section>;
  renameSection: (id: string, name: string) => Promise<Section>;
  deleteSection: (id: string, moveNotesToRoot?: boolean) => Promise<void>;
  createNote: (title: string, sectionId?: string | null) => Promise<WorkspaceNote>;
  renameNote: (id: string, newTitle: string) => Promise<WorkspaceNote>;
  // silent: não mostra toast em caso de erro (o chamador trata, ex.: badge do autosave)
  updateNote: (id: string, patch: NoteUpdate, options?: { silent?: boolean }) => Promise<WorkspaceNote>;
  toggleFavorite: (noteId: string) => Promise<WorkspaceNote>;
  moveNoteToSection: (noteId: string, sectionId: string | null) => Promise<WorkspaceNote>;
  deleteNote: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Os erros das operações continuam subindo para o chamador (que decide o que fazer na tela),
// mas antes viram um toast em pt-BR. Em caso de sucesso nada é exibido.
async function withToast<T>(action: string, run: () => Promise<T>, silent = false): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (!silent) reportError(err, action);
    throw err;
  }
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [notes, setNotes] = useState<WorkspaceNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega seções e notas da workspace ativa
  const loadWorkspaceData = useCallback(async (wsId: string) => {
    try {
      const [fetchedSections, fetchedNotes] = await Promise.all([
        workspaceService.getSections(wsId),
        workspaceService.getNotes(wsId),
      ]);
      setSections(fetchedSections);
      setNotes(fetchedNotes);
    } catch (err) {
      reportError(err, "Não foi possível carregar suas notas", "load-workspace-data");
    }
  }, []);

  // Carrega workspaces iniciais
  const loadAll = useCallback(async () => {
    try {
      const wsList = await workspaceService.getWorkspaces();
      setWorkspaces(wsList);

      const savedActiveId = workspaceService.getActiveWorkspaceId();
      const currentActive = wsList.find((w) => w.id === savedActiveId) || wsList[0] || null;

      setActiveWorkspace(currentActive);
      if (currentActive) {
        workspaceService.setActiveWorkspaceId(currentActive.id);
        await loadWorkspaceData(currentActive.id);
      } else {
        setSections([]);
        setNotes([]);
      }
    } catch (err) {
      reportError(err, "Não foi possível carregar seus workspaces", "load-workspaces");
    } finally {
      setIsLoading(false);
    }
  }, [loadWorkspaceData]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadAll();
  }, [loadAll]);

  useEffect(() => {
    // setState só acontece depois do await dentro de loadAll (isLoading já começa true)
    void (async () => {
      await loadAll();
    })();
  }, [loadAll]);

  const switchWorkspace = useCallback((workspaceId: string) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target) {
      setActiveWorkspace(target);
      workspaceService.setActiveWorkspaceId(target.id);
      loadWorkspaceData(target.id);
    }
  }, [workspaces, loadWorkspaceData]);

  const createWorkspace = useCallback(async (name: string, description?: string) => {
    const created = await withToast("Não foi possível criar o workspace", () =>
      workspaceService.createWorkspace(name, description)
    );
    setWorkspaces((prev) => [created, ...prev]);
    setActiveWorkspace(created);
    workspaceService.setActiveWorkspaceId(created.id);
    setSections([]);
    setNotes([]);
    return created;
  }, []);

  const deleteWorkspace = useCallback(async (id: string) => {
    await withToast("Não foi possível excluir o workspace", () => workspaceService.deleteWorkspace(id));
    const updated = workspaces.filter((w) => w.id !== id);
    setWorkspaces(updated);
    if (activeWorkspace?.id === id) {
      const nextActive = updated[0] || null;
      setActiveWorkspace(nextActive);
      if (nextActive) {
        workspaceService.setActiveWorkspaceId(nextActive.id);
        loadWorkspaceData(nextActive.id);
      } else {
        setSections([]);
        setNotes([]);
      }
    }
  }, [workspaces, activeWorkspace, loadWorkspaceData]);

  const createSection = useCallback(async (name: string) => {
    if (!activeWorkspace) throw new Error("Nenhuma workspace ativa");
    const created = await withToast("Não foi possível criar a seção", () =>
      workspaceService.createSection(activeWorkspace.id, name)
    );
    setSections((prev) => [...prev, created]);
    return created;
  }, [activeWorkspace]);

  const renameSection = useCallback(async (id: string, name: string) => {
    const updated = await withToast("Não foi possível renomear a seção", () =>
      workspaceService.renameSection(id, name)
    );
    setSections((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const deleteSection = useCallback(async (id: string, moveNotesToRoot = true) => {
    await withToast("Não foi possível excluir a seção", () =>
      workspaceService.deleteSection(id, moveNotesToRoot)
    );
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (moveNotesToRoot) {
      setNotes((prev) =>
        prev.map((n) => (n.sectionId === id ? { ...n, sectionId: null } : n))
      );
    } else {
      setNotes((prev) => prev.filter((n) => n.sectionId !== id));
    }
  }, []);

  const createNote = useCallback(async (title: string, sectionId?: string | null) => {
    if (!activeWorkspace) throw new Error("Nenhuma workspace ativa");
    const created = await withToast("Não foi possível criar a nota", () =>
      workspaceService.createNote(activeWorkspace.id, title, sectionId)
    );
    setNotes((prev) => [created, ...prev]);
    return created;
  }, [activeWorkspace]);

  const renameNote = useCallback(async (id: string, newTitle: string) => {
    const updated = await withToast("Não foi possível renomear a nota", () =>
      workspaceService.renameNote(id, newTitle)
    );
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const updateNote = useCallback(async (id: string, patch: NoteUpdate, options?: { silent?: boolean }) => {
    const updated = await withToast(
      "Não foi possível salvar a nota",
      () => workspaceService.updateNote(id, patch),
      options?.silent
    );
    // Mescla para não perder campos (ex.: content) caso a API devolva a nota parcial
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    return updated;
  }, []);

  // Alterna o favorito; não altera updatedAt (ver workspaceService.updateNote)
  const toggleFavorite = useCallback(async (noteId: string) => {
    const current = notes.find((n) => n.id === noteId);
    return updateNote(noteId, { isFavorite: !current?.isFavorite });
  }, [notes, updateNote]);

  const moveNoteToSection = useCallback(async (noteId: string, sectionId: string | null) => {
    const updated = await withToast("Não foi possível mover a nota", () =>
      workspaceService.moveNoteToSection(noteId, sectionId)
    );
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    return updated;
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    await withToast("Não foi possível excluir a nota", () => workspaceService.deleteNote(id));
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        workspaces,
        sections,
        notes,
        isLoading,
        switchWorkspace,
        createWorkspace,
        deleteWorkspace,
        createSection,
        renameSection,
        deleteSection,
        createNote,
        renameNote,
        updateNote,
        toggleFavorite,
        moveNoteToSection,
        deleteNote,
        refresh,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace deve ser utilizado dentro de um WorkspaceProvider");
  }
  return context;
}

