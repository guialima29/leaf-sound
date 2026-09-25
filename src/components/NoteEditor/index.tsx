"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { ArrowLeft } from "lucide-react";
import TitleWithBar from "@/components/TitleWithBar";
import TextEditor from "@/components/TextEditor";
import { SpinnerBadge } from "@/components/SpinnerBadge";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { useWorkspace } from "@/contexts/workspace-context";

interface NoteEditorProps {
  noteId: string;
  onBack?: () => void;
}

export function NoteEditor({ noteId, onBack }: NoteEditorProps) {
  const { notes, renameNote } = useWorkspace();
  const [editorData, setEditorData] = useState<OutputData | undefined>();
  const [noteTitle, setNoteTitle] = useState("Nova Nota");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Flush on unmount or when noteId changes
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

  // Load note data when noteId changes
  useEffect(() => {
    setIsLoading(true);
    try {
      const note = storage.getNote(noteId);
      if (note) {
        setNoteTitle(note.title || "Nova Nota");
        setEditorData(note.content);
      } else {
        const wsNote = notes.find((n) => n.id === noteId);
        if (wsNote) {
          setNoteTitle(wsNote.title || "Nova Nota");
          setEditorData(wsNote.content);
        } else {
          setNoteTitle("Nova Nota");
          setEditorData(undefined);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar nota:", err);
    } finally {
      setIsLoading(false);
    }
  }, [noteId, notes]);

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

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center gap-3 py-16">
        <Spinner className="size-8 text-primary" />
        <span className="text-sm text-muted-foreground">Carregando nota...</span>
      </div>
    );
  }

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
