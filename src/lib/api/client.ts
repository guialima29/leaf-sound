// Configuração base de cliente API para comunicação com backend Go

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Erro de resposta HTTP da API (status fora de 2xx). Falhas de rede (servidor fora do ar,
// CORS, sem internet) não passam por aqui: o fetch lança TypeError e ele sobe como está.
export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`API Error [${status}]: ${body}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Fornecedor do token de autenticação (ex.: Clerk `getToken`). Fica pronto para a integração
// futura: enquanto nenhum for registrado, nenhuma requisição leva o cabeçalho Authorization.
export type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

export function setApiTokenGetter(getter: TokenGetter | null): void {
  tokenGetter = getter;
}

// Sessão inválida/expirada: manda o usuário para o login (não há sessão real ainda).
// Não redireciona se já estiver em /login, para não entrar em loop de recarregamento.
function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/login")) return;
  // Fora de componente React (sem useRouter); a navegação completa também descarta o estado local
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/login");
}

// Tempo máximo de cada requisição (ms). Sem isso um servidor pendurado travaria a fila de gravações
// da nota (e a reabertura dela) para sempre. Estourar vira um erro "TimeoutError" (ver errors.ts).
export const REQUEST_TIMEOUT_MS = 15000;

function withTimeout(signal: AbortSignal | null | undefined): AbortSignal | undefined {
  if (typeof AbortSignal === "undefined" || typeof AbortSignal.timeout !== "function") {
    return signal ?? undefined;
  }
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = tokenGetter ? await tokenGetter() : null;
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    signal: withTimeout(customConfig.signal),
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      redirectToLogin();
    }
    throw new ApiError(response.status, errorBody || response.statusText);
  }

  // 204 No Content ou 200 sem corpo: retorna vazio (response.json() lançaria "Unexpected end of JSON input")
  if (response.status === 204) {
    return {} as T;
  }
  const text = await response.text();
  if (!text.trim()) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}
