import type { OutputData } from "@editorjs/editorjs";
import { isApiMode } from "./workspace-service";

// Rascunhos de alterações que não chegaram ao servidor (modo API), em memória do módulo:
// sobrevivem à troca de nota (o NoteEditor é desmontado), mas não ao recarregamento da página.
// No modo local não são usados (a gravação é síncrona), então todas as funções viram no-op.
export interface NoteDraft {
  content?: OutputData;
  title?: string;
}

const drafts = new Map<string, NoteDraft>();

// Notas excluídas nesta sessão (vale nos dois modos). Evita guardar rascunho de uma nota que
// não existe mais e permite ao editor pular o salvamento ao sair de uma nota recém-excluída.
// Os ids são únicos e nunca reaparecem, então o conjunto não precisa ser limpo.
const deletedNotes = new Set<string>();

export function markNoteDeleted(noteId: string): void {
  deletedNotes.add(noteId);
  drafts.delete(noteId);
}

export function isNoteDeleted(noteId: string): boolean {
  return deletedNotes.has(noteId);
}

export function getDraft(noteId: string): NoteDraft | undefined {
  if (!isApiMode) return undefined;
  const draft = drafts.get(noteId);
  return draft ? { ...draft } : undefined;
}

// Grava o rascunho. Com `onlyIfAbsent`, não sobrescreve o que já existe (usado por falhas
// atrasadas de envios antigos, para não trocar um rascunho mais novo por um antigo).
export function setDraft(noteId: string, patch: NoteDraft, onlyIfAbsent = false): void {
  if (!isApiMode || deletedNotes.has(noteId)) return;
  const next: NoteDraft = { ...drafts.get(noteId) };
  if (patch.content !== undefined && !(onlyIfAbsent && next.content !== undefined)) next.content = patch.content;
  if (patch.title !== undefined && !(onlyIfAbsent && next.title !== undefined)) next.title = patch.title;
  if (next.content !== undefined || next.title !== undefined) drafts.set(noteId, next);
}

// Apaga o campo do rascunho depois de um salvamento bem-sucedido. Com `expected`, só apaga se
// o rascunho ainda for exatamente aquele valor (um rascunho mais novo é preservado).
export function clearDraft(noteId: string, field: "content" | "title", expected?: unknown): void {
  const draft = drafts.get(noteId);
  if (!draft) return;
  if (expected !== undefined) {
    const current = draft[field];
    const same =
      field === "title"
        ? typeof current === "string" && current.trim() === String(expected).trim()
        : current === expected;
    if (!same) return;
  }
  delete draft[field];
  if (draft.content === undefined && draft.title === undefined) drafts.delete(noteId);
}
