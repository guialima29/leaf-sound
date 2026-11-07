import { toast } from "sonner";
import { ApiError } from "./client";

export const MSG_RATE_LIMIT = "Muitas requisições, tente em instantes";
export const MSG_UNAUTHORIZED = "Sessão expirada. Faça login novamente.";

// Motivo do erro em pt-BR, para mostrar ao usuário.
export function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return MSG_UNAUTHORIZED;
    if (err.status === 429) return MSG_RATE_LIMIT;
    if (err.status === 403) return "Você não tem permissão para esta ação.";
    if (err.status === 404) return "Item não encontrado no servidor.";
    if (err.status === 413) return "O conteúdo é grande demais para ser salvo.";
    if (err.status === 400 || err.status === 422) return "O servidor recusou os dados enviados.";
    if (err.status >= 500) return "Erro no servidor. Tente novamente em instantes.";
    return `Erro inesperado do servidor (${err.status}).`;
  }
  // fetch rejeitado (servidor fora do ar, CORS, sem internet)
  if (err instanceof TypeError) return "Não foi possível conectar ao servidor.";
  if (err instanceof Error && err.message) return err.message;
  return "Erro desconhecido.";
}

// Mostra um toast de erro (pt-BR). `action` descreve o que falhou, ex.: "Não foi possível criar a nota".
// 401 e 429 mostram só a mensagem do motivo. `id` evita toasts repetidos para o mesmo problema.
export function reportError(err: unknown, action: string, id?: string): void {
  console.error(`${action}:`, err);
  const reason = describeError(err);
  // Na tela de login o 401 é esperado (não há redirecionamento para ela mesma): sem toast
  if (
    err instanceof ApiError &&
    err.status === 401 &&
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/login")
  ) {
    return;
  }
  if (err instanceof ApiError && (err.status === 401 || err.status === 429)) {
    toast.error(reason, { id });
    return;
  }
  toast.error(action, { description: reason, id });
}
