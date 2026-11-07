"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { ArrowLeft, Star } from "lucide-react";
import TitleWithBar from "@/components/TitleWithBar";
import TextEditor from "@/components/TextEditor";
import Spinner from "@/components/Spinner";
import { SpinnerBadge } from "@/components/SpinnerBadge";
import { Button } from "@/components/ui/button";
import { workspaceService, isApiMode, type NoteUpdate } from "@/lib/api/workspace-service";
import { toast } from "sonner";
import { reportError } from "@/lib/api/errors";
import { getDraft, setDraft, clearDraft } from "@/lib/api/drafts";
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
// key={noteId} em workspace/page.tsx).
// - Modo local: primeiro da lista do contexto (a lista local já traz o conteúdo) e, se ela
//   ainda não estiver lá (carga direta de /workspace?noteId=X), via workspaceService.getNote.
// - Modo API: SEMPRE busca a nota completa com getNote antes de montar o editor, porque a
//   listagem pode vir sem `content` e um autosave sobre uma nota "vazia" apagaria o servidor.
export function NoteEditor({ noteId, onBack }: NoteEditorProps) {
  const { notes, isLoading } = useWorkspace();
  const contextNote = notes.find((n) => n.id === noteId);
  // null = ainda carregando; { note: undefined } = nota não encontrada;
  // { failed: true } = erro ao buscar (rede, 5xx...), com opção de tentar de novo
  const [loaded, setLoaded] = useState<{ note: WorkspaceNote | undefined; failed?: boolean } | null>(null);

  // Padrão "ajustar estado durante o render" (sem setState em efeito)
  if (!isApiMode && loaded === null && contextNote) {
    setLoaded({ note: contextNote });
  }

  // Modo local: só busca fora do contexto depois que o contexto terminou de carregar
  const needsFetch = loaded === null && (isApiMode || (!contextNote && !isLoading));
  useEffect(() => {
    if (!needsFetch) return;
    let cancelled = false;
    workspaceService
      .getNote(noteId)
      .then((note) => {
        if (!cancelled) setLoaded((prev) => prev ?? { note });
      })
      .catch((err) => {
        if (cancelled) return;
        reportError(err, "Não foi possível carregar a nota", `load-note-${noteId}`);
        setLoaded((prev) => prev ?? { note: undefined, failed: true });
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

  if (loaded.failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground">Não foi possível carregar a nota.</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLoaded(null)} className="cursor-pointer">
            Tentar novamente
          </Button>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Ver todas as notas</span>
            </Button>
          )}
        </div>
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
  const { notes, updateNote, toggleFavorite } = useWorkspace();
  // Modo API: alterações que não chegaram ao servidor (falha ao salvar / ao sair da nota)
  // ficam em memória (lib/api/drafts) e têm prioridade sobre o que veio do servidor.
  // Lido uma vez, na montagem (no modo local é sempre undefined).
  const [draft] = useState(() => getDraft(noteId));
  const editorData = draft?.content ?? initialNote.content;
  const [noteTitle, setNoteTitle] = useState(
    draft?.title?.trim() ? draft.title : initialNote.title || "Nova Nota"
  );

  // Acompanha renomeações externas (ex.: sidebar) sem reverter o que o usuário digita:
  // o "eco" do próprio updateNote do editor (lastSentTitle) é ignorado.
  // Padrão "ajustar estado durante o render" (sem setState em efeito).
  const contextNote = notes.find((n) => n.id === noteId);
  const contextTitle = contextNote?.title;
  const isFavorite = contextNote?.isFavorite ?? false;
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
  // Com rascunho de conteúdo restaurado, o novo salvamento já está agendado ("Editando...")
  const [isSaving, setIsSaving] = useState(draft?.content !== undefined);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Falha ao salvar (API): o que não foi salvo continua pendente (refs abaixo) e é reenviado
  // no próximo salvamento, ao trocar de nota ou pelo botão "Tentar novamente" do badge.
  const [saveError, setSaveError] = useState(false);
  const hadSaveErrorRef = useRef(false);

  const pendingDataRef = useRef<OutputData | null>(null);
  const pendingTitleRef = useRef<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);
  // true entre o desmonte e uma eventual nova montagem: respostas atrasadas de envios antigos
  // não devem sobrescrever/limpar o rascunho gravado pelo salvamento ao sair da nota
  const unmountedRef = useRef(false);

  // Guarda no rascunho o que falhou ao salvar (modo API). Montado: o pendente mais novo;
  // desmontado: só preenche o que ainda não tem rascunho.
  const rememberFailed = useCallback(
    (patch: { content?: OutputData; title?: string }) => {
      setDraft(noteId, patch, unmountedRef.current);
    },
    [noteId]
  );

  // Apaga do rascunho o que acabou de ser salvo. Desmontado: só se o rascunho for exatamente
  // aquele valor (um mais novo é preservado).
  const forgetSaved = useCallback(
    (field: "content" | "title", value: OutputData | string) => {
      clearDraft(noteId, field, unmountedRef.current ? value : undefined);
    },
    [noteId]
  );

  // Marca a falha de salvamento. O toast aparece só na primeira falha de uma sequência
  // (o autosave tenta de novo a cada edição; o badge continua mostrando o erro).
  const markSaveFailed = useCallback(
    (err: unknown) => {
      setSaveError(true);
      // Depois de sair da nota quem avisa é o toast do salvamento ao sair
      if (hadSaveErrorRef.current || unmountedRef.current) {
        console.error("Erro ao salvar nota:", err);
        return;
      }
      hadSaveErrorRef.current = true;
      reportError(err, "Não foi possível salvar a nota", `save-note-${noteId}`);
    },
    [noteId]
  );

  // Limpa o erro quando não resta nada pendente (conteúdo e título já foram enviados)
  const markSaveOkIfIdle = useCallback(() => {
    if (pendingDataRef.current === null && pendingTitleRef.current === null) {
      hadSaveErrorRef.current = false;
      setSaveError(false);
    }
  }, []);

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
        await updateNote(
          noteId,
          { content: data, description: extractDescription(data) },
          { silent: true }
        );
        // Só limpa o pendente se ninguém digitou mais nada durante o salvamento
        if (pendingDataRef.current === data) pendingDataRef.current = null;
        forgetSaved("content", data);
        setLastSaved(new Date());
        markSaveOkIfIdle();
      } catch (err) {
        // O conteúdo continua em pendingDataRef (e no rascunho) para a próxima tentativa
        rememberFailed({ content: unmountedRef.current ? data : (pendingDataRef.current ?? data) });
        markSaveFailed(err);
      } finally {
        // Continua "Editando..." se já há um novo salvamento agendado
        setIsSaving(saveTimerRef.current !== null);
      }
    },
    [noteId, updateNote, markSaveFailed, markSaveOkIfIdle, rememberFailed, forgetSaved]
  );

  // Flush on unmount (a troca de nota desmonta o componente via key={noteId}).
  // Salva conteúdo e título pendentes em uma única atualização. updateNote do contexto
  // grava pelo service de forma síncrona (modo local) e é do provider, que continua
  // montado, então o grid já enxerga a nota atualizada ao voltar para a listagem.
  // No modo API a gravação é assíncrona e pode falhar: antes de tentar, o pendente vai para o
  // rascunho, que só é apagado depois do sucesso; se falhar, o toast avisa e a nota restaura
  // o rascunho ao ser reaberta.
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
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

      if (Object.keys(patch).length === 0) return;

      if (!isApiMode) {
        updateNote(noteId, patch).catch((err) => {
          console.error("Erro ao salvar pendências na troca/desmonte:", err);
        });
        return;
      }

      setDraft(noteId, { content: patch.content, title: patch.title });
      updateNote(noteId, patch, { silent: true })
        .then(() => {
          if (patch.content !== undefined) clearDraft(noteId, "content", patch.content);
          if (patch.title !== undefined) clearDraft(noteId, "title", patch.title);
        })
        .catch((err) => {
          reportError(
            err,
            "Não foi possível salvar as alterações ao sair da nota. Elas serão restauradas ao reabrir.",
            `leave-save-${noteId}`
          );
        });
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

  // Envia o título; se falhar, ele volta a ficar pendente (a menos que o usuário já tenha digitado outro)
  const sendTitle = useCallback(
    async (title: string) => {
      try {
        setLastSentTitle(title);
        await updateNote(noteId, { title }, { silent: true });
        forgetSaved("title", title);
        setLastSaved(new Date());
        markSaveOkIfIdle();
      } catch (err) {
        if (pendingTitleRef.current === null) pendingTitleRef.current = title;
        rememberFailed({ title: unmountedRef.current ? title : (pendingTitleRef.current ?? title) });
        markSaveFailed(err);
      }
    },
    [noteId, updateNote, markSaveFailed, markSaveOkIfIdle, rememberFailed, forgetSaved]
  );

  // Handle title changes with 400ms debounce and sync
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setNoteTitle(newTitle);
      pendingTitleRef.current = newTitle;
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }

      titleTimerRef.current = setTimeout(() => {
        titleTimerRef.current = null;
        const title = pendingTitleRef.current;
        pendingTitleRef.current = null;
        // Título vazio/só espaços mantém o anterior no armazenamento (nada a enviar)
        if (title === null || !title.trim()) return;
        void sendTitle(title);
      }, 400);
    },
    [sendTitle]
  );

  // Botão "Tentar novamente" do badge: reenvia o que ficou pendente (título e conteúdo)
  const handleRetry = useCallback(() => {
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
      titleTimerRef.current = null;
    }
    const title = pendingTitleRef.current;
    pendingTitleRef.current = null;
    if (title !== null && title.trim()) void sendTitle(title);
    if (pendingDataRef.current) void flushSave();
  }, [sendTitle, flushSave]);

  // Restaura o rascunho (modo API): conteúdo/título voltam como pendentes e o autosave normal
  // (3000 ms conteúdo, 400 ms título) tenta enviar de novo.
  useEffect(() => {
    if (!draft) return;
    toast.info("Restauramos alterações não salvas desta nota", { id: `restore-${noteId}` });
    if (draft.content !== undefined) {
      const content = draft.content;
      pendingDataRef.current = content;
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        void flushSave(content);
      }, 3000);
    }
    if (draft.title?.trim()) {
      pendingTitleRef.current = draft.title;
      titleTimerRef.current = setTimeout(() => {
        titleTimerRef.current = null;
        const title = pendingTitleRef.current;
        pendingTitleRef.current = null;
        if (title !== null && title.trim()) void sendTitle(title);
      }, 400);
    }
  }, [draft, noteId, flushSave, sendTitle]);

  return (
    <div className="w-full flex flex-col pb-16">
      {/* Barra de ações superior */}
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
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleFavorite(noteId).catch((err) => {
                console.error("Erro ao alterar favorito:", err);
              });
            }}
            aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar nota"}
            aria-pressed={isFavorite}
            title={isFavorite ? "Remover dos favoritos" : "Favoritar nota"}
            className="size-8 cursor-pointer"
          >
            <Star
              className={`size-4 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          </Button>
          <SpinnerBadge
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasError={saveError}
            onRetry={handleRetry}
            className="mb-0"
          />
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
