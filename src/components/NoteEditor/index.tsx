"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { ArrowLeft } from "lucide-react";
import TitleWithBar from "@/components/TitleWithBar";
import TextEditor from "@/components/TextEditor";
import { SpinnerBadge } from "@/components/SpinnerBadge";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { useWorkspace } from "@/contexts/workspace-context";
import type { WorkspaceNote } from "@/types/workspace";

interface NoteEditorProps {
  noteId: string;
  onBack?: () => void;
}

// Leitura única da nota (síncrona). O componente é recriado a cada troca de nota
// via key={noteId} em workspace/page.tsx, então não precisa re-sincronizar.
function loadInitialNote(
  noteId: string,
  notes: WorkspaceNote[]
): { title: string; content?: OutputData } {
  try {
    const note = storage.getNote(noteId) ?? notes.find((n) => n.id === noteId);
    if (note) {
      return { title: note.title || "Nova Nota", content: note.content };
    }
  } catch (err) {
    console.error("Erro ao carregar nota:", err);
  }
  return { title: "Nova Nota", content: undefined };
}

export function NoteEditor({ noteId, onBack }: NoteEditorProps) {
  const { notes, renameNote } = useWorkspace();
  const [initialNote] = useState(() => loadInitialNote(noteId, notes));
  const editorData = initialNote.content;
  const [noteTitle, setNoteTitle] = useState(initialNote.title);

  // Acompanha renomeações externas (ex.: sidebar) sem reverter o que o usuário digita:
  // o "eco" do próprio renameNote do editor (lastSentTitle) é ignorado.
  // Padrão "ajustar estado durante o render" (sem setState em efeito).
  const contextTitle = notes.find((n) => n.id === noteId)?.title;
  const [prevContextTitle, setPrevContextTitle] = useState(contextTitle);
  const [lastSentTitle, setLastSentTitle] = useState<string | null>(null);
  if (contextTitle !== prevContextTitle) {
    setPrevContextTitle(contextTitle);
    // workspaceService.renameNote aplica trim(), então compara com o título enviado já normalizado
    if (contextTitle !== undefined && contextTitle !== lastSentTitle?.trim()) {
      setNoteTitle(contextTitle);
      setLastSentTitle(null);
    }
  }
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const pendingDataRef = useRef<OutputData | null>(null);
  const currentNoteIdRef = useRef<string>(noteId);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep currentNoteIdRef in sync
  useEffect(() => {
    currentNoteIdRef.current = noteId;
  }, [noteId]);

  // Flush save function
  const flushSave = useCallback((dataToSave?: OutputData) => {
    const data = dataToSave || pendingDataRef.current;
    const targetId = currentNoteIdRef.current;
    if (!data || !targetId) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    try {
      setIsSaving(true);
      const descBlock = data.blocks?.find(
        (b: { type: string; data?: { text?: string } }) => b.type === "paragraph"
      );
      const description =
        (descBlock?.data?.text || "").replace(/<[^>]*>?/gm, "").slice(0, 100) ||
        "Sem descrição";

      storage.saveNote({
        id: targetId,
        content: data,
        description,
      });

      pendingDataRef.current = null;
      setLastSaved(new Date());
    } catch (err) {
      console.error("Erro ao salvar nota:", err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Flush on unmount (a troca de nota desmonta o componente via key={noteId})
  useEffect(() => {
    return () => {
      if (pendingDataRef.current && currentNoteIdRef.current) {
        const data = pendingDataRef.current;
        const targetId = currentNoteIdRef.current;
        try {
          const descBlock = data.blocks?.find(
            (b: { type: string; data?: { text?: string } }) => b.type === "paragraph"
          );
          const description =
            (descBlock?.data?.text || "").replace(/<[^>]*>?/gm, "").slice(0, 100) ||
            "Sem descrição";

          storage.saveNote({
            id: targetId,
            content: data,
            description,
          });
        } catch (err) {
          console.error("Erro ao flushSave na troca/desmonte:", err);
        }
        pendingDataRef.current = null;
      }
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
        titleTimerRef.current = null;
      }
    };
  }, [noteId]);

  // Handle editor text changes with 3s debounce
  const handleChange = useCallback(
    (data: OutputData) => {
      if (!data.blocks) return;
      pendingDataRef.current = data;
      setIsSaving(true);

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        flushSave(data);
      }, 3000);
    },
    [flushSave]
  );

  // Handle title changes with debounce and sync
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setNoteTitle(newTitle);
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }

      titleTimerRef.current = setTimeout(async () => {
        try {
          setLastSentTitle(newTitle);
          await renameNote(noteId, newTitle);
          storage.saveNote({ id: noteId, title: newTitle });
          setLastSaved(new Date());
        } catch (err) {
          console.error("Erro ao sincronizar título da nota:", err);
        }
      }, 400);
    },
    [noteId, renameNote]
  );

  return (
    <div className="w-full flex flex-col pb-16">
      {/* Top action bar without redundant EditorHeader */}
      <div className="flex items-center justify-between px-6 py-2.5 mb-6 border-b border-sidebar-border bg-background/80 backdrop-blur-xs sticky top-0 z-20">
        <div>
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-2.5 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Ver todas as notas</span>
            </Button>
          )}
        </div>
        <div>
          <SpinnerBadge isSaving={isSaving} lastSaved={lastSaved} className="mb-0" />
        </div>
      </div>

      {/* Note Title with inline edit */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <TitleWithBar
          title={noteTitle}
          editable={true}
          onTitleChange={handleTitleChange}
          maxLength={40}
        />
      </div>

      {/* Editor Body */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <TextEditor
          key={noteId}
          initialData={editorData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default NoteEditor;

