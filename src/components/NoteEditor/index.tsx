"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { ArrowLeft } from "lucide-react";
import TitleWithBar from "@/components/TitleWithBar";
import TextEditor from "@/components/TextEditor";
import Spinner from "@/components/Spinner";
import { SpinnerBadge } from "@/components/SpinnerBadge";
import { Button } from "@/components/ui/button";
import { workspaceService, type NoteUpdate } from "@/lib/api/workspace-service";
import { useWorkspace } from "@/contexts/workspace-context";
import type { WorkspaceNote } from "@/types/workspace";

interface NoteEditorProps {
  noteId: string;
  onBack?: () => void;
}

// Descrição da nota = primeiro bloco "paragraph", sem tags HTML, até 100 caracteres
function extractDescription(data: OutputData): string {
  const descBlock = data.blocks?.find(
    (b: { type: string; data?: { text?: string } }) => b.type === "paragraph"
  );
  return (descBlock?.data?.text || "").replace(/<[^>]*>?/gm, "").slice(0, 100) || "Sem descrição";
}

// Resolve a nota uma única vez (o componente é recriado a cada troca de nota via
// key={noteId} em workspace/page.tsx): primeiro da lista do contexto e, se ela ainda
// não estiver lá (carga direta de /workspace?noteId=X), via workspaceService.getNote.
export function NoteEditor({ noteId, onBack }: NoteEditorProps) {
  const { notes, isLoading } = useWorkspace();
  const contextNote = notes.find((n) => n.id === noteId);
  // null = ainda carregando; { note: undefined } = nota não encontrada
  const [loaded, setLoaded] = useState<{ note: WorkspaceNote | undefined } | null>(null);

  // Padrão "ajustar estado durante o render" (sem setState em efeito)
  if (loaded === null && contextNote) {
    setLoaded({ note: contextNote });
  }

  // Só busca fora do contexto depois que o contexto terminou de carregar
  const needsFetch = loaded === null && !contextNote && !isLoading;
  useEffect(() => {
    if (!needsFetch) return;
    let cancelled = false;
    workspaceService
      .getNote(noteId)
      .then((note) => {
        if (!cancelled) setLoaded((prev) => prev ?? { note });
      })
      .catch((err) => {
        console.error("Erro ao carregar nota:", err);
        if (!cancelled) setLoaded((prev) => prev ?? { note: undefined });
      });
    return () => {
      cancelled = true;
    };
  }, [needsFetch, noteId]);

  if (loaded === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Spinner className="size-6 text-primary" />
        <p className="text-sm text-muted-foreground">Carregando nota...</p>
      </div>
    );
  }

  if (!loaded.note) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground">Nota não encontrada.</p>
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 cursor-pointer">
            <ArrowLeft className="size-3.5" />
            <span>Ver todas as notas</span>
          </Button>
        )}
      </div>
    );
  }

  return <NoteEditorBody noteId={noteId} initialNote={loaded.note} onBack={onBack} />;
}

interface NoteEditorBodyProps {
  noteId: string;
  initialNote: WorkspaceNote;
  onBack?: () => void;
}

function NoteEditorBody({ noteId, initialNote, onBack }: NoteEditorBodyProps) {
  const { notes, updateNote } = useWorkspace();
  const editorData = initialNote.content;
  const [noteTitle, setNoteTitle] = useState(initialNote.title || "Nova Nota");

  // Acompanha renomeações externas (ex.: sidebar) sem reverter o que o usuário digita:
  // o "eco" do próprio updateNote do editor (lastSentTitle) é ignorado.
  // Padrão "ajustar estado durante o render" (sem setState em efeito).
  const contextTitle = notes.find((n) => n.id === noteId)?.title;
  const [prevContextTitle, setPrevContextTitle] = useState(contextTitle);
  const [lastSentTitle, setLastSentTitle] = useState<string | null>(null);
  if (contextTitle !== prevContextTitle) {
    setPrevContextTitle(contextTitle);
    // workspaceService.updateNote aplica trim(), então compara com o título enviado já normalizado
    if (contextTitle !== undefined && contextTitle !== lastSentTitle?.trim()) {
      setNoteTitle(contextTitle);
      setLastSentTitle(null);
    }
  }
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const pendingDataRef = useRef<OutputData | null>(null);
  const pendingTitleRef = useRef<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Flush save function (conteúdo)
  const flushSave = useCallback(
    async (dataToSave?: OutputData) => {
      const data = dataToSave || pendingDataRef.current;
      if (!data) return;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      try {
        setIsSaving(true);
        await updateNote(noteId, { content: data, description: extractDescription(data) });
        // Só limpa o pendente se ninguém digitou mais nada durante o salvamento
        if (pendingDataRef.current === data) pendingDataRef.current = null;
        setLastSaved(new Date());
      } catch (err) {
        console.error("Erro ao salvar nota:", err);
      } finally {
        // Continua "Editando..." se já há um novo salvamento agendado
        setIsSaving(saveTimerRef.current !== null);
      }
    },
    [noteId, updateNote]
  );

  // Flush on unmount (a troca de nota desmonta o componente via key={noteId}).
  // Salva conteúdo e título pendentes em uma única atualização. updateNote do contexto
  // grava pelo service de forma síncrona (modo local) e é do provider, que continua
  // montado, então o grid já enxerga a nota atualizada ao voltar para a listagem.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
        titleTimerRef.current = null;
      }

      const patch: NoteUpdate = {};
      const data = pendingDataRef.current;
      if (data) {
        patch.content = data;
        patch.description = extractDescription(data);
      }
      const title = pendingTitleRef.current;
      if (title !== null && title.trim()) {
        patch.title = title;
      }
      pendingDataRef.current = null;
      pendingTitleRef.current = null;

      if (Object.keys(patch).length > 0) {
        updateNote(noteId, patch).catch((err) => {
          console.error("Erro ao salvar pendências na troca/desmonte:", err);
        });
      }
    };
  }, [noteId, updateNote]);

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
        saveTimerRef.current = null;
        void flushSave(data);
      }, 3000);
    },
    [flushSave]
  );

  // Handle title changes with 400ms debounce and sync
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setNoteTitle(newTitle);
      pendingTitleRef.current = newTitle;
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }

      titleTimerRef.current = setTimeout(async () => {
        titleTimerRef.current = null;
        const title = pendingTitleRef.current;
        pendingTitleRef.current = null;
        // Título vazio/só espaços mantém o anterior no armazenamento (nada a enviar)
        if (title === null || !title.trim()) return;
        try {
          setLastSentTitle(title);
          await updateNote(noteId, { title });
          setLastSaved(new Date());
        } catch (err) {
          console.error("Erro ao sincronizar título da nota:", err);
        }
      }, 400);
    },
    [noteId, updateNote]
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
