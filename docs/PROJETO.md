# LeafSound — Documentação do Projeto

> Estado analisado em 2026-11-03 (commit `ab863db`, branch `main`).
>
> ⚠️ **Este documento descreve o código antes das correções.** Na branch `fix/backlog-correcoes` vários pontos já mudaram: o `lib/storage.ts` não existe mais, a partitura salva sozinha, os acordes estão corrigidos, as fontes e a paleta verde foram aplicadas, os favoritos existem e o lint passa. Do §11, já foram tratados os itens 1–6, 10 e 11, e o 12 em parte (o CI existe, os testes ainda não). O que mudou está em [`PROGRESSO.md`](PROGRESSO.md).
> Complementa o planejamento GSD em [`.planning/`](../.planning/) — aqui está **o que o código faz hoje**; lá está **o que se planejou fazer**.

---

## 1. O que é

**LeafSound** é um bloco de anotações musicais no estilo Notion. O usuário tem **workspaces**, cada um com **seções** (pastas de um nível) e **notas**. Cada nota é um documento em blocos (Editor.js) que mistura texto (título, parágrafo, lista, código) com **blocos musicais**: **partitura** (VexFlow) e **diagramas de acordes** (VexChords).

- Projeto acadêmico (IFMS) — documento de requisitos original em [`leaf-sound-docs.pdf`](../leaf-sound-docs.pdf).
- Este repositório é **só o frontend**. O backend será um serviço **Go** separado; enquanto ele não existe, tudo é salvo no **`localStorage`** do navegador.
- UI em **pt-BR**.

---

## 2. Stack

| Camada | Tecnologia | Observação |
|---|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack no dev) | `package.json` pede `^16.3.0` |
| UI | **React 19**, **Tailwind CSS 4**, **shadcn/ui** (estilo `new-york`, base `neutral`) | componentes em `src/components/ui/` |
| Ícones | `lucide-react` | |
| Editor | **Editor.js 2.31** + header, paragraph, list, code | carregado só no cliente via `import()` dinâmico |
| Notação musical | **VexFlow 5** (partitura), **VexChords 1.2** (acordes) | tipagem própria em `src/types/vexchords.d.ts` |
| Estado | React Context (`WorkspaceProvider`) + **TanStack Query** (usado só no grid de notas) | |
| Auth | **Clerk** (`@clerk/nextjs` 6) | só o middleware está ligado; ver §10 |
| Lint | ESLint 9 + `eslint-config-next` (core-web-vitals + typescript) | |
| Testes | — | não há testes automatizados |

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`.

Variável de ambiente opcional: **`NEXT_PUBLIC_API_URL`** — se definida, a camada de dados tenta a API Go antes do `localStorage` (§6). Não há `.env` no repositório.

---

## 3. Estrutura de pastas

```
src/
├── app/                       # Rotas (App Router)
│   ├── layout.tsx             # Root: <html lang="pt-br">, QueryProvider, CSS global + do editor
│   ├── page.tsx               # "/"           Landing page
│   ├── login/page.tsx         # "/login"      Tela de login (botão Google é só um link)
│   ├── workspace/page.tsx     # "/workspace"  App principal (sidebar + editor/grid)
│   ├── editor/page.tsx        # "/editor"     Legado: redireciona p/ /workspace?noteId=
│   ├── editor/editor-styles.css  # Estilos do Editor.js e dos blocos musicais (512 linhas)
│   └── globals.css            # Tailwind 4 + tokens shadcn
├── components/
│   ├── ui/                    # Primitivos shadcn (não editar à mão, regenerar via CLI)
│   ├── app-sidebar.tsx        # Sidebar do workspace (monta as peças abaixo)
│   ├── workspace-switcher.tsx # Dropdown de troca/criação de workspace
│   ├── nav-workspace-tree.tsx # Árvore seções → notas, context menu, drag & drop
│   ├── sidebar-quick-actions.tsx # Botões "+ Nota" / "+ Seção"
│   ├── nav-user.tsx           # Card do usuário (dados fixos, logout sem ação)
│   ├── NoteEditor/            # Editor de uma nota: título + TextEditor + autosave
│   ├── TextEditor/            # Wrapper do Editor.js (registra as tools)
│   ├── Pagination/            # Grid paginado de NoteCards (12 por página)
│   ├── Home*/, Header, Footer, VideoComponent, CardHomeTemplate…  # Landing
│   └── …dialogs (SectionCreate/Delete, ConfirmDelete, WorkspaceCreateForm)
├── contexts/workspace-context.tsx  # WorkspaceProvider + useWorkspace()
├── lib/
│   ├── api/client.ts          # fetch genérico p/ API Go
│   ├── api/workspace-service.ts # CRUD de workspaces/seções/notas (API → fallback localStorage)
│   ├── storage.ts             # CRUD legado de notas (só localStorage) — ainda usado pelo editor
│   ├── editorjs/tools/        # Tools customizadas: LeafMusicPartituraTool, LeafMusicAcordesTool
│   └── utils.ts               # cn()
├── types/
│   ├── workspace.ts           # Workspace, Section, WorkspaceNote
│   ├── editor-music.ts        # Contrato JSON dos blocos musicais + type guards
│   └── vexchords.d.ts
├── hooks/                     # use-mobile (usado), useDebounce e useGoogleAuth (não usados)
├── providers/query-provider.tsx  # QueryClient + WorkspaceProvider
├── constants/                 # Textos/links da landing e dados demo
├── fonts/fonts.tsx            # next/font (Libre Caslon, Poppins) — NÃO importado
└── middleware.tsx             # clerkMiddleware() em todas as rotas
```

---

## 4. Rotas

| Rota | Tipo | O que faz |
|---|---|---|
| `/` | Server Component | Landing: Header, texto + vídeo do YouTube, features, "como funciona", exemplo, footer |
| `/login` | Server Component | Logo + botão "Login com o Google" que é um `<Link href="/workspace">` (sem auth real) |
| `/workspace` | Client (`Suspense` por causa de `useSearchParams`) | Sidebar + área central. Com `?noteId=` → `NoteEditor`; sem nota e 0 notas → `EmptyNotes`; senão → título + grid paginado |
| `/workspace?noteId=<uuid>` | — | Abre a nota no editor. O parâmetro `?id=` também é aceito |
| `/editor?id=<uuid>` | Client | Redirect legado para `/workspace?noteId=` |

A URL é a fonte da verdade de qual nota está aberta: sidebar, grid e "+ Nota" fazem `router.push('/workspace?noteId=…', { scroll: false })`.

---

## 5. Arquitetura e fluxo de dados

```
RootLayout
└─ QueryProvider (QueryClient, staleTime 60s)
   └─ WorkspaceProvider  ← carrega no mount: workspaces, workspace ativo, seções e notas
      └─ /workspace
         ├─ AppSidebar
         │   ├─ WorkspaceSwitcher ───── switchWorkspace / abre WorkspaceCreateForm
         │   ├─ NavWorkspaceTree ────── create/rename/move/delete (nota e seção) via contexto
         │   ├─ SidebarQuickActions ─── createNote / createSection via contexto
         │   └─ NavUser (estático)
         └─ main
             ├─ NoteEditor(noteId) ─── lê/grava conteúdo via lib/storage.ts (!)
             │   └─ TextEditor ─────── Editor.js + tools musicais
             └─ PaginationDemo ─────── useQuery lendo lib/storage.ts (!)
```

Fluxo de edição de uma nota:

```
Usuário digita → Editor.js onChange → editor.save() → OutputData
  → NoteEditor.handleChange: guarda em pendingDataRef, badge "Editando..."
  → debounce 3s → flushSave → storage.saveNote({ id, content, description })
  → troca de nota / desmontagem → flush imediato do pendente
Título: TitleWithBar (input, máx 40) → debounce 400ms → renameNote (contexto) + storage.saveNote
```

`description` da nota = primeiro bloco `paragraph`, sem tags HTML, cortado em 100 caracteres (ou "Sem descrição").

---

## 6. Camada de dados

### 6.1 Chaves do `localStorage`

| Chave | Conteúdo |
|---|---|
| `leaf-sound-workspaces` | `Workspace[]` |
| `leaf-sound-active-workspace-id` | id do workspace ativo |
| `leaf-sound-sections` | `Section[]` de todos os workspaces |
| `leaf-sound-notes` | notas de todos os workspaces (título, metadados **e** conteúdo Editor.js) |

Na primeira carga, `initializeLocalStorage()` cria o workspace `default-workspace` ("Principal") e migra notas antigas sem `workspaceId` para ele.

### 6.2 Modelo (`src/types/workspace.ts`)

```ts
Workspace     { id, name, description?, createdAt, updatedAt }
Section       { id, workspaceId, name, order, createdAt, updatedAt }   // sem aninhamento
WorkspaceNote { id, workspaceId, sectionId?: string|null,             // null = raiz ("Notas Gerais")
                title, description?, content?: OutputData, order?, isFavorite?,
                createdAt, updatedAt, lastUpdateDate, lastUpdateTime, href }
```

`lastUpdateDate`/`lastUpdateTime` são strings já formatadas em pt-BR; `href` é legado. `isFavorite` e `order` existem no tipo mas não são usados por nenhuma tela.

### 6.3 Duas camadas sobre a mesma chave

| | `lib/api/workspace-service.ts` | `lib/storage.ts` (legado) |
|---|---|---|
| Usado por | `WorkspaceProvider` (sidebar, switcher, quick actions) | `NoteEditor` (conteúdo e título), `PaginationDemo` (grid), `CardNewNote` |
| API Go | Sim: se `NEXT_PUBLIC_API_URL` existe tenta a API e, **se falhar, cai no localStorage** com `console.warn` | Não |
| Assíncrono | Sim (`Promise`) | Não |

Ambas leem e escrevem `leaf-sound-notes`. Funciona hoje porque tudo é local, mas é a principal dívida técnica para integrar o backend (§11).

### 6.4 Contrato esperado da API Go (inferido do `workspace-service`)

```
GET    /api/workspaces
POST   /api/workspaces                         { name, description }
DELETE /api/workspaces/:id
GET    /api/workspaces/:id/sections
POST   /api/workspaces/:id/sections            { name }
PATCH  /api/sections/:id                       { name }
DELETE /api/sections/:id?moveNotesToRoot=bool
GET    /api/workspaces/:id/notes
POST   /api/workspaces/:id/notes               { title, sectionId }
PATCH  /api/notes/:id                          { title }
PATCH  /api/notes/:id/section                  { sectionId }
DELETE /api/notes/:id
```

Não existe endpoint para salvar o **conteúdo** da nota — hoje ele só vai para o `localStorage`. Nenhuma chamada envia token de autenticação.

---

## 7. Editor e blocos musicais

### 7.1 `TextEditor`

- Monta o Editor.js no `div#editorjs` depois do mount (todas as libs via `import()` dinâmico → nada de VexFlow no SSR).
- Tools registradas: `header` (só H2), `paragraph`, `list`, `code`, `leafMusic_partitura`, `leafMusic_acordes`.
- `initialData` é aplicado **só na criação**; o `NoteEditor` passa `key={noteId}` para recriar o editor ao trocar de nota.
- O `id` fixo `editorjs` impede dois editores na mesma página.

### 7.2 Contrato JSON (`src/types/editor-music.ts`)

Todo bloco musical salva `{ schemaVersion: 1, variant, payload }`. Os type guards `isLeafMusic*Data` validam a carga; dado inválido vira o default.

**Partitura** — bloco `leafMusic_partitura`
```json
{ "schemaVersion": 1, "variant": "partitura",
  "payload": { "notes": "C4/q D4/q E4/q F4/q", "clef": "treble", "timeSignature": "4/4",
               "width": 500, "height": 200 } }
```
- Entrada: texto `Nota+Oitava/duração` separado por espaço (`C#4/8`, `Bb3/h`). Durações: `w h q 8 16 32`; se omitida, repete a anterior. Tokens inválidos são ignorados em silêncio. Sem pausas, acordes, ligaduras ou múltiplos compassos.
- Clave: `treble` | `bass`. Compasso: `4/4` | `3/4` | `6/8`.
- Renderiza com a API de baixo nível do VexFlow (Renderer SVG 500×200, um `Stave`, `Voice` não estrita).
- **O estado só é atualizado quando a partitura é renderizada** (ao montar ou no botão "Renderizar Partitura").

**Acordes** — bloco `leafMusic_acordes`
```json
{ "schemaVersion": 1, "variant": "acordes",
  "payload": { "chords": [ { "name": "G", "chord": [[1,3],[2,0],[3,0],[4,0],[5,2],[6,3]],
                             "barres": [], "position": 1 } ],
               "tuning": ["E","A","D","G","B","E"], "numFrets": 5, "width": 100, "height": 120 } }
```
- `chord` = pares `[corda, casa]`, corda 1 = Mi agudo; casa `0` = solta, `"x"` = abafada.
- Campo de texto aceita 21 acordes de um dicionário fixo (C, Cm, C7, D… B7). **Nome desconhecido vira um acorde todo abafado** sem aviso.
- Botão "Personalizar Acorde (Modal)" abre um modal (DOM puro, anexado ao `body`) para informar casa de cada corda e casa inicial. Pestanas (`barres`) não são editáveis.
- Lista com botão "×" para remover. Diagramas desenhados com `ChordBox` (precisa de seletor CSS, por isso cada acorde ganha um `id` aleatório).

Ambas as tools são classes em DOM puro (sem React) e usam as classes CSS `leaf-music-partitura__*` / `leaf-music-acordes__*` de `editor-styles.css`.

---

## 8. Workspace (UI)

- **WorkspaceSwitcher**: lista workspaces (iniciais do nome como avatar), troca o ativo e abre o modal "Criar Workspace" (nome até 30, descrição até 60). Não há UI para excluir workspace, embora o contexto tenha `deleteWorkspace`.
- **NavWorkspaceTree**:
  - Seções colapsáveis com contador; "Notas Gerais" = notas sem seção.
  - Clique direito na **seção**: nova nota nela, renomear, excluir (diálogo com escolha: mover notas para a raiz ou apagar tudo).
  - Clique direito na **nota**: abrir, renomear (diálogo, máx 40), mover para…, excluir.
  - **Drag & drop** nativo do HTML5 entre seções e raiz.
- **SidebarQuickActions**: "+ Nota" (cria "Nova Nota" na raiz e abre) e "+ Seção".
- **Grid** (`PaginationDemo`): `NoteCard` com imagem fixa, título, descrição, data "Last update" e botão "Acessar". 12 por página.
- Ordenação: notas por `updatedAt` desc; seções por `order`.

---

## 9. Landing, login e visual

- Landing em `/`: componentes `Home*`, textos em `src/constants/`. Vídeo do YouTube (nocookie) carregado só no cliente.
- `.planning/DESIGN.md` define paleta verde (`#5DAB3C` principal, `#43563B`, `#2E332B`, `#55B042`) e cantos 6–8px. Na prática, `globals.css` ainda usa os tokens **neutros** padrão do shadcn; os verdes aparecem como cores fixas em classes (`bg-[#5DAA3B]`, `text-[#2B3328]`). `theme.txt` guarda duas paletas (azul/verde) não aplicadas.
- Dark mode: os tokens `.dark` principais estão comentados; não há toggle.
- Fontes: o CSS usa `--font-libre-caslon-text` e `--font-poppins`, mas `src/fonts/fonts.tsx` **não é importado** no layout, então as fontes do Google não são carregadas (os títulos só ficam em Libre Caslon se ela estiver instalada na máquina).

---

## 10. Autenticação (estado atual)

- `src/middleware.tsx` roda `clerkMiddleware()` em todas as rotas, mas **não protege nenhuma** (nenhum `auth.protect()`).
- Não há `<ClerkProvider>` no layout → os hooks do Clerk (`useGoogleAuth`) quebrariam se usados; por isso não são.
- `/login` só navega para `/workspace`. `NavUser` mostra "Músico / estudos@leafsound.com" fixo e o "Log out" não faz nada.
- Next 16 passou a chamar o arquivo de `middleware` de **`proxy`**; o nome antigo ainda funciona, mas está depreciado.

---

## 11. Diagnóstico — problemas encontrados

Ordenados por impacto. "Confirmado" = verificado executando ou lendo o fluxo completo; "Provável" = lido no código, não reproduzido no navegador.

### Funcionais

1. **Grid de notas desatualizado** (Confirmado no código). `PaginationDemo` usa `useQuery(['notes', wsId])` lendo `storage.ts`, com `staleTime` de 60s, e nada invalida essa query quando o contexto cria/renomeia/move/exclui notas ou quando o editor salva. Ao clicar em "Ver todas as notas" o grid pode mostrar títulos/descrições antigos ou faltar notas recentes.
2. **Partitura perde edição se não clicar em "Renderizar"** (Confirmado no código). Digitar notas ou trocar clave/compasso não altera `this.data` nem dispara o `onChange` do Editor.js (mudar `value` de `<input>` não muta o DOM). Só o render atualiza o estado.
3. **Dicionário de acordes errado**: 14 dos 21 shapes estão incorretos (C7, Cm, Dm, F, Fm, F7, Gm, G7, A, Am, A7, B, Bm, B7). Corretos só C, D, D7, E, Em, E7 e G. E um acorde digitado fora do dicionário vira "tudo abafado" sem aviso (Confirmado). Tabela corrigida em [`TAREFAS.md`](TAREFAS.md) T05.
4. **Título pode "voltar" enquanto digita** (Provável). `NoteEditor` recarrega a nota sempre que `notes` do contexto muda; 400ms após digitar, `renameNote` atualiza `notes`, o efeito relê o título salvo e o `TitleWithBar` sincroniza o `input` — se o usuário continuou digitando nesse intervalo, as letras novas podem ser sobrescritas.
5. **Nota criada pelo `CardNewNote` não aparece na sidebar** até recarregar (usa `storage.createNote` direto, sem passar pelo contexto). Hoje o caminho é quase inalcançável (o grid só mostra esse modal quando contexto e storage divergem).
6. **Favoritos (`isFavorite`) não existem na UI**, apesar de serem requisito (NOTE-04) e estarem no tipo.

### Integração com backend

7. **Conteúdo da nota nunca vai para a API.** Com `NEXT_PUBLIC_API_URL` definida, notas criadas pela API não existem no `localStorage`, então `storage.saveNote` lança "Note not found to save" e o autosave falha silenciosamente (só `console.error`).
8. **Fallback silencioso**: qualquer erro de API vira gravação local sem avisar o usuário → dados divergentes entre servidor e navegador.
9. `apiClient` não envia token/cookie de autenticação.

### Qualidade / build

10. **`npm run lint` falha**: 7 erros + 1 aviso (o `STATE.md` diz que lint passou — não é mais verdade com `eslint-config-next` 16). Quase todos são a regra nova do React Compiler `react-hooks/set-state-in-effect`:
    `NoteEditor:109`, `SectionCreateDialog:34`, `TextEditor:24`, `TitleWithBar:23`, `workspace-context:75`, `use-mobile:14`, mais `react-hooks/purity` em `ui/sidebar.tsx:611` e um import não usado em `login/page.tsx:1`.
11. `tsc --noEmit` acusa erro só por cache velho em `.next/types` (rota `/dashboard` que não existe mais) — some apagando `.next/`.
12. Sem testes automatizados e sem CI.

### Segurança

13. Os blocos de texto do Editor.js guardam HTML (`<b>`, `<a>`…). Hoje ele só é renderizado dentro do próprio Editor.js (que sanitiza), e a descrição do card remove tags — ok. Atenção futura: nunca renderizar `block.data.text` com `dangerouslySetInnerHTML` sem sanitizar.
14. Nenhum header de segurança configurado em `next.config.ts` (previsto na fase de segurança).

### Documentação de planejamento (GSD) inconsistente

15. `ROADMAP.md` tem três numerações diferentes: a lista diz "Phase 4: Bloco de acordes", o detalhe diz "Phase 4: Workspace e ciclo de notas", e a tabela de progresso marca a Fase 3 como "Not started" enquanto `STATE.md` diz que ela foi concluída. `REQUIREMENTS.md` marca todos os requisitos como Pending, mesmo os já entregues (DATA-01, WORK-01, NOTE-01/02/03/05, EDIT-04).
16. Os blocos musicais (Fase 1) já cobrem **partitura e acordes**; **tablatura** (EDIT-02) ainda não existe.

---

## 12. Código não utilizado

Não importados por nenhum arquivo:

- Componentes: `CardBeneficio`, `CardCreateNote`, `CreateNoteCard`, `EditorHeader`, `RegisterArea`, `nav-main.tsx`, `nav-projects.tsx`
- Hooks: `useDebounce`, `useGoogleAuth`
- Constantes: `constBeneficios`, `constNoteCards`, `notesDemo.json` (804 linhas)
- `src/fonts/fonts.tsx` (deveria ser usado — ver §9)
- Dependências aparentemente sem uso: `@shadcn/ui`, `lucide` (o projeto usa `lucide-react`), `use-debounce`, `react-textarea-autosize`, `cn` (o `cn()` vem de `lib/utils`)
- Arquivos soltos na raiz: `theme.txt`

---

## 13. Onde está cada coisa (atalhos)

| Quero mexer em… | Arquivo |
|---|---|
| Tempo do autosave / como salva | `src/components/NoteEditor/index.tsx` |
| Tools disponíveis no editor | `src/components/TextEditor/index.tsx` |
| Bloco de partitura | `src/lib/editorjs/tools/LeafMusicPartituraTool.ts` |
| Bloco de acordes / dicionário de acordes | `src/lib/editorjs/tools/LeafMusicAcordesTool.ts` |
| Formato JSON dos blocos musicais | `src/types/editor-music.ts` |
| Estilos do editor e blocos | `src/app/editor/editor-styles.css` |
| CRUD de workspace/seção/nota | `src/lib/api/workspace-service.ts` + `src/contexts/workspace-context.tsx` |
| Sidebar (árvore, menus, drag & drop) | `src/components/nav-workspace-tree.tsx` |
| Grid de cards | `src/components/Pagination/index.tsx`, `src/components/NoteCard/index.tsx` |
| Layout da página do workspace | `src/app/workspace/page.tsx` |
| Cores / tema | `src/app/globals.css`, `.planning/DESIGN.md` |
