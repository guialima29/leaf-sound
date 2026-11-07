# LeafSound — Backlog de correções

> Criado em 2026-11-03 a partir do diagnóstico em [`PROJETO.md`](PROJETO.md) §11.
> Cada tarefa foi escrita para ser executada **por um subagente, uma por vez, na ordem**. Ela traz contexto, arquivos, passos, critérios de aceite e como verificar.

## Ordem e dependências

> **Status em 2026-11-07:** **backlog concluído (T01–T11).** T01–T07 mergeadas na `main` (PR #1). T08–T11 na branch `fix/backlog-correcoes` (PR #2 com T08–T11, aberto, aguardando merge). O que foi feito, as decisões tomadas e as pendências que sobraram estão em [`PROGRESSO.md`](PROGRESSO.md).

| # | Tarefa | Tipo | Tamanho | Depende de | Status |
|---|---|---|---|---|---|
| T01 | Deixar o `npm run lint` verde (e corrigir o título que "volta") | qualidade + bug | M | — | ✅ |
| T02 | CI no GitHub Actions (lint + build) | qualidade | P | T01 | ✅ (Node 22) |
| T03 | Unificar a camada de dados (fim do `storage.ts`) | bug + arquitetura | G | T01 | ✅ |
| T04 | Partitura salva sem precisar clicar em "Renderizar" | bug | M | T01 | ✅ |
| T05 | Acordes: corrigir o dicionário e avisar quando o acorde é desconhecido | bug | M | — | ✅ |
| T06 | Fontes e paleta verde do DESIGN.md | visual | M | — | ✅ |
| T07 | Favoritos (NOTE-04) | feature | M | T03 | ✅ |
| T08 | Remover código e dependências não usados | limpeza | P | T03, T07 | ✅ |
| T09 | Headers de segurança + `middleware` → `proxy` | segurança | P | — | ✅ |
| T10 | API: erros visíveis em vez de fallback silencioso + contrato documentado | arquitetura | M | T03 | ✅ |
| T11 | Sincronizar os documentos do GSD com o código | docs | P | todas | ✅ (continua no GSD) |

Tamanho: P = até ~1h, M = algumas horas, G = meio dia ou mais.

Fora desta lista (são features novas e merecem conversa própria antes): **tablatura (EDIT-02)**, **autenticação Clerk de verdade (AUTH-01..03)**, **barra musical com metrônomo (EDIT-05)**.

---

## Instruções comuns para todo subagente

Cole isto no início do prompt de cada tarefa:

> Você vai executar **uma única tarefa** do backlog do LeafSound (Next.js 16, React 19, Editor.js, VexFlow; frontend apenas, dados em `localStorage`).
> 1. Leia `docs/PROJETO.md` (visão geral) e a seção da sua tarefa em `docs/TAREFAS.md`. Não faça nada de outras tarefas.
> 2. Siga o estilo do código ao redor (pt-BR na UI e nos comentários, aspas e ponto e vírgula iguais aos do arquivo).
> 3. Antes de terminar, rode `npm run lint` e `npm run build`. Os dois precisam passar, a não ser que a tarefa diga outra coisa (antes da T01, o lint já falha; nesse caso não aumente o número de erros).
> 4. Faça **um commit** no padrão do repositório (`fix: …`, `feat: …`, `update: …`, `chore: …`) sem dar push.
> 5. Responda com: o que mudou (arquivos), o que verificou e como, o que não conseguiu verificar (ex.: comportamento no navegador) e os passos manuais para eu testar.

---

## T01 — Deixar o `npm run lint` verde

**Problema.** O `npm run lint` falha com 7 erros e 1 aviso. A maioria vem da regra `react-hooks/set-state-in-effect` (React Compiler, trazida pelo `eslint-config-next` 16). Um desses pontos também causa um bug: no `NoteEditor`, o efeito que carrega a nota roda de novo toda vez que `notes` do contexto muda, e 400ms depois de digitar o título o `renameNote` muda `notes`. Aí o título é relido do storage e pode apagar letras digitadas nesse intervalo.

**Arquivos e correção de cada erro:**

| Local | Correção |
|---|---|
| `src/app/login/page.tsx:1` | Remover o import `Header` que não é usado. |
| `src/components/TextEditor/index.tsx:24` | O estado `isMounted` não é necessário (o componente é `"use client"` e efeitos só rodam no cliente). Remover `isMounted`, sempre renderizar o `div#editorjs` e iniciar o editor num `useEffect(..., [])`. Manter o cleanup com `destroy()`. Atenção ao Strict Mode do dev: o efeito roda duas vezes, então o `initEditor` assíncrono precisa checar se o efeito foi cancelado (flag `cancelled` no cleanup) antes de criar o `EditorJS`, para não surgirem dois editores. |
| `src/components/TitleWithBar/index.tsx:23` | Tornar o input **controlado pelo pai**: remover o `useState`/`useEffect` internos e usar `value={title}`, chamando `onTitleChange` no `onChange`. Quem chama com `editable` (`NoteEditor`) já guarda `noteTitle` em estado. |
| `src/components/NoteEditor/index.tsx:109` | Parar de "sincronizar" com o efeito. Em `src/app/workspace/page.tsx`, renderizar `<NoteEditor key={noteId} …/>` para que trocar de nota recrie o componente. Dentro do `NoteEditor`, ler a nota **uma vez** com inicializador lazy: `useState(() => storage.getNote(noteId) ?? notes.find(...))` para título e conteúdo. Remover `isLoading` (a leitura é síncrona). O efeito de flush no unmount continua valendo, e com o `key` ele roda na troca de nota. Isso também resolve o bug do título que volta. |
| `src/components/SectionCreateDialog/index.tsx:34` | Remover o `useEffect` que faz `setName(initialName)`. Nos dois lugares que usam o diálogo (`nav-workspace-tree.tsx` e `sidebar-quick-actions.tsx`), passar `key` (ex.: `key={editingSection?.id ?? "new"}` e um contador/`isOpen`) para que o estado inicial seja recriado a cada abertura. Alternativa: resetar o nome dentro do `onOpenChange` quando abrir. |
| `src/contexts/workspace-context.tsx:75` | O efeito chama `refresh()`, que faz `setIsLoading(true)` de forma síncrona. Extrair um `loadAll()` que só chama `setState` **depois** de `await` (o `isLoading` já começa `true`), chamar `loadAll()` no efeito e deixar `refresh = async () => { setIsLoading(true); await loadAll(); }` para uso manual. |
| `src/hooks/use-mobile.ts:14` | Reescrever com `useSyncExternalStore`, assinando `matchMedia("(max-width: 767px)")`. `getServerSnapshot` retorna `false`. |
| `src/components/ui/sidebar.tsx:611` (`react-hooks/purity`) | Trocar `useMemo(() => Math.random…)` por `useState(() => …)` (o inicializador lazy é permitido). Esse arquivo é do shadcn: mexer só nessa linha. |

Também apagar a pasta `.next/` (cache antigo que faz o `tsc --noEmit` acusar a rota `/dashboard`, que não existe mais).

**Critérios de aceite**
- `npm run lint` termina com 0 erros e 0 avisos.
- `npx tsc --noEmit` passa.
- `npm run build` passa.
- Trocar de nota pela sidebar continua salvando o conteúdo pendente da nota anterior.
- Digitar o título rápido e sem parar por ~2s não perde caracteres.
- Os diálogos de criar e renomear seção abrem com o nome certo (vazio para criar, nome atual para renomear).

**Teste manual:** criar 2 notas, digitar texto na 1, trocar para a 2 em menos de 3s, voltar para a 1 e conferir que o texto está lá. Recarregar a página e conferir de novo.

---

## T02 — CI no GitHub Actions

**Problema.** Não há verificação automática. O requisito CI-01 pede lint + build em toda alteração.

**Solução.** Criar `.github/workflows/ci.yml`:
- Disparar em `push` para `main` e em `pull_request`.
- `ubuntu-latest`, `actions/setup-node` com Node 20 e cache de npm.
- Passos: `npm ci` → `npm run lint` → `npx tsc --noEmit` → `npm run build`.
- O `package.json` tem `allowScripts` desligando alguns pós-install (`sharp`, `@tailwindcss/oxide`, …). Confirmar que o `npm ci` + build funcionam no Linux. Se o build quebrar por isso, documentar e ajustar.
- O build não pode depender de chaves do Clerk. Se o `clerkMiddleware` falhar sem `CLERK_*`, registrar isso no resumo (e a T09 ou a futura tarefa de auth resolve).

**Critérios de aceite:** workflow válido. Rodando os mesmos comandos localmente numa cópia limpa (`npm ci` numa pasta nova), tudo passa. Adicionar o badge do CI no `README.md`.

**Verificação:** depois do push (feito por mim, não pelo subagente), conferir a aba Actions no GitHub.

---

## T03 — Unificar a camada de dados

**Problema.** Existem duas camadas lendo e gravando a mesma chave `leaf-sound-notes`:
- `lib/api/workspace-service.ts` (assíncrona, tenta a API Go) → usada pelo contexto e pela sidebar.
- `lib/storage.ts` (síncrona, só local) → usada pelo `NoteEditor` (conteúdo e título), pelo grid `PaginationDemo` (via `useQuery`, cache de 60s) e pelo `CardNewNote`.

Efeitos:
1. O grid mostra dados velhos depois de editar, criar ou renomear.
2. Nota criada pelo `CardNewNote` não aparece na sidebar.
3. O conteúdo da nota nunca chega à API.
4. Com a API ligada, `storage.saveNote` lança "Note not found" e o autosave falha em silêncio.

**Solução**
1. Em `workspace-service.ts`, adicionar:
   - `getNote(noteId): Promise<WorkspaceNote | undefined>` (API: `GET /api/notes/:id`; local: procura na chave).
   - `updateNote(noteId, patch: Partial<Pick<WorkspaceNote, "title" | "content" | "description" | "isFavorite">>)` (API: `PATCH /api/notes/:id`; local: merge + atualiza `updatedAt`, `lastUpdateDate`, `lastUpdateTime`). O `renameNote` atual passa a chamar `updateNote(id, { title })`.
   - Extrair os helpers repetidos (`readList<T>(key)`, `writeList(key, list)`, `formatPtBrDate()`).
2. Em `workspace-context.tsx`, expor `updateNote(id, patch)`, que atualiza o item em `notes` no estado.
3. `NoteEditor`:
   - Carregar a nota de `notes` do contexto (com o `key={noteId}` da T01 a leitura acontece uma vez). Se ainda não estiver na lista, usar `workspaceService.getNote`.
   - O `flushSave` chama `updateNote(id, { content, description })`. O título chama `updateNote(id, { title })`. Extrair `extractDescription(data)` para não duplicar o código entre o `flushSave` e o cleanup.
   - No flush do unmount, chamar o service direto (não depende de estado React desmontado).
4. `PaginationDemo`: remover o `useQuery` e o `storage`. Usar `notes` do contexto (já filtradas pelo workspace ativo e ordenadas por `updatedAt`). Trocar o modal `CardNewNote` por `createNote` do contexto + navegação (igual ao "+ Nota" da sidebar).
5. Apagar `src/lib/storage.ts` e o `CardNewNote` se ficarem sem uso. **Minha decisão:** manter o `@tanstack/react-query` instalado e o provider, porque deve ser útil quando o backend entrar. Fica registrado na T08 para reavaliar.
6. Manter a compatibilidade dos dados já salvos: o formato no `localStorage` não muda.

**Critérios de aceite**
- `grep -r "lib/storage" src` não encontra nada.
- Editar uma nota, clicar em "Ver todas as notas": o card já mostra a descrição nova e a data atualizada.
- Renomear pela sidebar reflete no editor e no grid. Renomear no editor reflete na sidebar e no grid.
- Notas antigas existentes no navegador continuam abrindo com o conteúdo.
- Lint e build passam.

**Teste manual:** antes de rodar, exportar `localStorage` (DevTools → Application) como backup. Depois: criar, editar, renomear, mover, excluir e recarregar.

---

## T04 — Partitura salva sem precisar clicar em "Renderizar"

**Problema.** Em `src/lib/editorjs/tools/LeafMusicPartituraTool.ts`, digitar notas ou trocar clave/compasso não atualiza `this.data` nem avisa o Editor.js. Só o botão "Renderizar" (ou a renderização inicial) salva. Também há o risco de Enter/Backspace dentro do `<input>` serem capturados pelo Editor.js (criando ou apagando blocos).

**Solução**
1. Receber `{ data, api, block }` no construtor e guardar o `block` (`BlockAPI`).
2. Nos eventos `input` do campo de notas e `change` dos `<select>`: atualizar `this.data.payload` na hora, chamar `this.block?.dispatchChange()` (dispara o `onChange` do editor → autosave) e re-renderizar o preview com debounce de ~400ms.
3. Manter o botão como "Atualizar" ou removê-lo. **Minha decisão:** remover, porque o preview passa a ser automático.
4. Nos inputs/selects da tool, `keydown` com `e.stopPropagation()` para Enter, Backspace, Delete e Tab, para o Editor.js não agir sobre eles. Mesmo tratamento nos inputs da `LeafMusicAcordesTool` (o Enter de "Adicionar" continua funcionando).
5. Mostrar abaixo do preview quais tokens foram ignorados (ex.: "Ignorado: `H4/q`"). O `parseNotesString` passa a retornar `{ notes, invalid }`.
6. Fazer o mesmo `dispatchChange()` na tool de acordes ao adicionar/remover (hoje funciona por mutação de DOM, mas fica explícito e robusto).

**Critérios de aceite:** digitar `E4/h G4/h`, esperar 3s sem clicar em nada, recarregar a página → a partitura volta com essas notas. Enter dentro do input não cria um bloco novo. Token inválido aparece listado.

---

## T05 — Acordes: dicionário correto e aviso de acorde desconhecido

**Problema.** Em `LeafMusicAcordesTool.ts`, `parseChordString` usa um dicionário de 21 acordes, e **14 estão com o desenho errado**. Um nome fora do dicionário vira um acorde todo abafado, sem aviso.

**Convenção do VexChords:** `[corda, casa]`, corda 1 = Mi agudo, corda 6 = Mi grave, `"x"` = abafada, `0` = solta. Com `position: 1` e `numFrets: 5`, as casas são absolutas.

**Dicionário corrigido** (notação comum de 6→1 entre parênteses):

```ts
C:  [[1,0],[2,1],[3,0],[4,2],[5,3],[6,"x"]],   // x32010 (já correto)
Cm: [[1,3],[2,4],[3,5],[4,5],[5,3],[6,"x"]],   // x35543  barres: [{fromString:5,toString:1,fret:3}]
C7: [[1,0],[2,1],[3,3],[4,2],[5,3],[6,"x"]],   // x32310
D:  [[1,2],[2,3],[3,2],[4,0],[5,"x"],[6,"x"]], // xx0232 (já correto)
Dm: [[1,1],[2,3],[3,2],[4,0],[5,"x"],[6,"x"]], // xx0231
D7: [[1,2],[2,1],[3,2],[4,0],[5,"x"],[6,"x"]], // xx0212 (já correto)
E:  [[1,0],[2,0],[3,1],[4,2],[5,2],[6,0]],     // 022100 (já correto)
Em: [[1,0],[2,0],[3,0],[4,2],[5,2],[6,0]],     // 022000 (já correto)
E7: [[1,0],[2,0],[3,1],[4,0],[5,2],[6,0]],     // 020100 (já correto)
F:  [[1,1],[2,1],[3,2],[4,3],[5,3],[6,1]],     // 133211  barres: [{fromString:6,toString:1,fret:1}]
Fm: [[1,1],[2,1],[3,1],[4,3],[5,3],[6,1]],     // 133111  barres: [{fromString:6,toString:1,fret:1}]
F7: [[1,1],[2,1],[3,2],[4,1],[5,3],[6,1]],     // 131211  barres: [{fromString:6,toString:1,fret:1}]
G:  [[1,3],[2,0],[3,0],[4,0],[5,2],[6,3]],     // 320003 (já correto)
Gm: [[1,3],[2,3],[3,3],[4,5],[5,5],[6,3]],     // 355333  barres: [{fromString:6,toString:1,fret:3}]
G7: [[1,1],[2,0],[3,0],[4,0],[5,2],[6,3]],     // 320001
A:  [[1,0],[2,2],[3,2],[4,2],[5,0],[6,"x"]],   // x02220
Am: [[1,0],[2,1],[3,2],[4,2],[5,0],[6,"x"]],   // x02210
A7: [[1,0],[2,2],[3,0],[4,2],[5,0],[6,"x"]],   // x02020
B:  [[1,2],[2,4],[3,4],[4,4],[5,2],[6,"x"]],   // x24442  barres: [{fromString:5,toString:1,fret:2}]
Bm: [[1,2],[2,3],[3,4],[4,4],[5,2],[6,"x"]],   // x24432  barres: [{fromString:5,toString:1,fret:2}]
B7: [[1,2],[2,0],[3,2],[4,1],[5,2],[6,"x"]],   // x21202
```

**Solução**
1. Mover o dicionário para `src/lib/editorjs/chords/guitar-chords.ts` com o tipo `{ chord: ChordPosition[]; barres?: ChordBarre[]; position?: number }` e usar os `barres` ao adicionar.
2. Normalizar a entrada: `trim`, primeira letra maiúscula, aceitar `C#`/`Db` etc. só se estiverem no dicionário (não inventar shapes).
3. Acorde desconhecido: **não adicionar**. Mostrar uma mensagem embaixo do input ("Acorde "X" não reconhecido. Use **Personalizar** para desenhá-lo.") e abrir o modal com o nome já preenchido ao clicar no link.
4. No modal "Personalizar", as cordas aparecem hoje como "Corda 1..6" sem dizer qual é qual: rotular como "6 (Mi grave) … 1 (Mi agudo)". Ao salvar, validar a casa (0–24 ou x) e mostrar o erro no próprio modal em vez de virar `0`.
5. Fechar o modal com Esc.

**Critérios de aceite:** os 21 acordes desenham o shape da tabela (conferir visualmente pelo menos A, Am, F, G7, B, Bm). Digitar `Xyz` mostra o aviso e não adiciona nada. Acordes salvos antes continuam renderizando (o formato do JSON não muda).

**Opcional, minha sugestão para depois:** usar um banco de acordes pronto (ex.: o pacote `@tombatossals/chords-db`, que tem todas as tonalidades e variações) em vez de manter o dicionário à mão. Precisa da sua aprovação por ser uma dependência nova.

---

## T06 — Fontes e paleta verde

**Problema.** `src/fonts/fonts.tsx` define Libre Caslon e Poppins via `next/font`, mas não é importado. O CSS usa `--font-libre-caslon-text` e `--font-poppins`, que ficam sem fonte real. Os tokens do `globals.css` são os neutros padrão do shadcn, enquanto o `.planning/DESIGN.md` pede verde (`#5DAB3C` principal, `#43563B`, `#2E332B`, `#55B042`) e cantos de 6–8px. Os verdes hoje estão espalhados como cores fixas (`bg-[#5DAA3B]`, `hover:bg-[#43563B]`, `text-[#2B3328]`).

**Solução**
1. No `src/app/layout.tsx`, importar `libreCaslonText` e `poppins` e aplicar `className={`${libreCaslonText.variable} ${poppins.variable} antialiased`}` no `<html>` ou no `<body>`. Remover de `globals.css` a definição manual `--font-libre-caslon-text: "Libre Caslon Text", serif` e ligar `--font-sans` a `var(--font-poppins)` no `@theme`.
2. No `:root`, trocar `--primary` → `#5DAB3C`, `--primary-foreground` → branco, `--ring` → verde, `--sidebar-primary` → `#43563B`, `--foreground` → `#2E332B`. Deixar o resto neutro. Manter `--radius: 0.5rem` (8px).
3. Substituir as cores fixas pelos tokens: `bg-[#5DAA3B]` → `bg-primary`, `hover:bg-[#43563B]` → `hover:bg-primary/90` (ou um token `--primary-hover`), `text-[#2B3328]` → `text-foreground`. Achar todas com `grep -rn "#5DAA3B\|#43563B\|#2B3328\|#5DAB3C" src`.
4. Conferir o contraste (texto branco sobre `#5DAB3C` dá ~2.9:1, abaixo do AA 4.5:1 para texto pequeno). **Minha decisão:** para botões com texto pequeno, usar `#43563B` como fundo, ou escurecer o primário para algo como `#3F8A2A`. Registrar a escolha no resumo.
5. Apagar o `theme.txt` (as paletas antigas ficam no histórico do git).

**Critérios de aceite:** no DevTools, os títulos usam Libre Caslon e o corpo usa Poppins carregadas do `/_next/static/media`. Botões principais, foco e itens ativos da sidebar ficam verdes. O `grep` acima não acha mais cores fixas fora de `ui/` e do CSS do editor.

**Decisão sua:** prefere que o verde fique só em ações (botões e foco), ou que também tinja a sidebar?

---

## T07 — Favoritos (NOTE-04)

**Problema.** O requisito NOTE-04 (favoritar e desfavoritar com indicação na lista) não existe na UI, embora `isFavorite` esteja no tipo `WorkspaceNote`.

**Solução** (usa o `updateNote` criado na T03)
1. Contexto: `toggleFavorite(noteId)` → `updateNote(id, { isFavorite: !atual })`.
2. Sidebar (`nav-workspace-tree.tsx`): um grupo "Favoritos" no topo, listando as notas favoritas do workspace. Elas continuam aparecendo também na sua seção. Item de menu de contexto "Favoritar" / "Remover dos favoritos" (ícone `Star` do lucide).
3. Editor: botão estrela na barra superior do `NoteEditor`, ao lado do `SpinnerBadge`.
4. Grid: estrela preenchida no `NoteCard` quando favorita. Favoritas aparecem primeiro na ordenação.
5. Mudar favorito **não** deve alterar `updatedAt` (não é edição de conteúdo). Tratar isso no `updateNote`.

**Critérios de aceite:** favoritar pelo menu, pelo editor e desfavoritar refletem nos três lugares. O estado sobrevive ao recarregar.

---

## T08 — Remover código e dependências não usados

**Remover** (confirmado com `grep` que ninguém importa; reconferir antes de apagar):
- Componentes: `CardBeneficio`, `CardCreateNote`, `CreateNoteCard`, `EditorHeader`, `RegisterArea`, `nav-main.tsx`, `nav-projects.tsx` (e o `CardNewNote`, se a T03 já não tiver apagado).
- Hooks: `useDebounce`. **Manter** o `useGoogleAuth` (vai ser usado na tarefa de auth).
- Constantes: `constBeneficios.ts`, `constNoteCards.ts`, `notesDemo.json`.
- Dependências: `@shadcn/ui`, `lucide`, `use-debounce`, `react-textarea-autosize`, `cn`, e `@tanstack/react-query` se continuar sem uso depois da T03 (nesse caso, o `QueryProvider` vira só `WorkspaceProvider`; renomear o arquivo de acordo).
- Componentes de `ui/` não usados: listar no resumo, mas **não apagar** (são do shadcn e baratos de manter).

**Decisão sua:** o `RegisterArea` (tela de cadastro) vai ser usado no futuro? Se sim, mantemos.

**Critérios de aceite:** lint e build passam, `npm ls` sem erros, `package-lock.json` atualizado via `npm uninstall`.

---

## T09 — Headers de segurança + renomear o middleware

**Solução**
1. `next.config.ts`: `async headers()` para todas as rotas com `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` e `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
2. CSP: **não** aplicar uma CSP bloqueante agora (Clerk, YouTube e os estilos inline do Editor.js/VexFlow precisam ser mapeados). Adicionar como `Content-Security-Policy-Report-Only` com uma política inicial (`default-src 'self'; frame-src https://www.youtube-nocookie.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'`) e registrar no resumo as violações vistas no console navegando pelas páginas.
3. Renomear `src/middleware.tsx` → `src/proxy.ts` (convenção do Next 16; conferir na doc do Next 16 instalada em `node_modules/next/dist/docs` ou no changelog o nome exato da export). Manter o `clerkMiddleware()` como está.
4. Adicionar `.env.example` com `NEXT_PUBLIC_API_URL=` e as variáveis do Clerk vazias.

**Critérios de aceite:** `curl -I http://localhost:3000/` (com `npm run start`) mostra os headers. As páginas `/`, `/login` e `/workspace` funcionam e o vídeo da landing carrega. Build sem aviso de middleware depreciado.

---

## T10 — API: erros visíveis + contrato documentado

**Problema.** Com `NEXT_PUBLIC_API_URL` definida, qualquer erro da API vira uma gravação local silenciosa (`console.warn`), o que deixa servidor e navegador divergentes. O `apiClient` não manda autenticação.

**Solução**
1. Escolher **um** modo por ambiente: com `NEXT_PUBLIC_API_URL`, usar só a API; sem ela, só o `localStorage`. Remover o fallback dentro de cada método. Dois "adapters" (`apiAdapter`, `localAdapter`) com a mesma interface, e o `workspaceService` escolhe um na inicialização.
2. Erros da API sobem até o contexto. Mostrar um toast (instalar `sonner` via shadcn: `npx shadcn@latest add sonner`) com mensagem em pt-BR. Para o autosave, o `SpinnerBadge` ganha um estado "Erro ao salvar" e o conteúdo fica pendente para nova tentativa.
3. `apiClient`: aceitar um `getToken?: () => Promise<string | null>` configurável e enviar `Authorization: Bearer …` quando houver. Fica pronto para o Clerk, sem integrar agora.
4. Tratar 401 (redirecionar para `/login`) e 429 (mensagem "Muitas requisições, tente em instantes").
5. Criar `docs/API.md` com o contrato que o backend Go precisa implementar: endpoints (os de `PROJETO.md` §6.4 + `GET /api/notes/:id` + `PATCH /api/notes/:id` com `{title?, content?, description?, isFavorite?}`), formatos JSON (`WorkspaceNote` com `content` = `OutputData` do Editor.js, incluindo os blocos musicais de `types/editor-music.ts`), códigos de erro e limites de payload sugeridos (ex.: 1 MB por nota).

**Critérios de aceite:** sem `NEXT_PUBLIC_API_URL`, tudo funciona igual a hoje. Com `NEXT_PUBLIC_API_URL=http://localhost:9999` (porta sem servidor), a UI mostra erro em vez de fingir que salvou.

---

## T11 — Sincronizar os documentos do GSD

**Problema.** O `ROADMAP.md` tem a numeração das fases inconsistente (a lista diz que a Fase 4 é "Bloco de acordes", o detalhe diz "Workspace e ciclo de notas", e a tabela de progresso marca a Fase 3 como não iniciada). O `REQUIREMENTS.md` marca tudo como Pending. O `STATE.md` diz que o lint passa.

**Solução**
1. Reescrever a lista, os detalhes e a tabela do `ROADMAP.md` com **uma** numeração: 1 Contrato de dados ✓ · 2 Workspaces/Seções ✓ · 3 NoteEditor no workspace ✓ · 4 Correções (este backlog) · 5 Tablatura · 6 Autenticação + API Go · 7 Polimento/CI · 8 Segurança · 9 Performance. Ajustar as dependências.
2. `REQUIREMENTS.md`: marcar como entregues DATA-01, EDIT-01 (acordes), EDIT-03 (partitura), EDIT-04, WORK-01, NOTE-01, NOTE-02, NOTE-03, NOTE-05, mais NOTE-04 e CI-01 se T07 e T02 estiverem feitas. Corrigir a tabela de rastreabilidade para as fases novas.
3. `STATE.md`: fase atual, o que foi feito neste backlog, próximo passo.
4. Apontar no `PROJECT.md` para `docs/PROJETO.md` como a referência do estado do código.

**Decisão sua:** quer continuar usando o GSD para as próximas fases? Se não, esta tarefa pode só congelar o `.planning/` com uma nota "histórico" e o `docs/` vira a fonte da verdade.

---

## Decisões em aberto (suas)

1. **T06:** verde só nas ações, ou também na sidebar?
2. **T08:** manter o `RegisterArea`?
3. **T11 (decidido por mim, pode mudar):** continuar com o GSD. O `.planning/` foi sincronizado; para congelá-lo é só marcá-lo como "histórico".
4. **T05 (opcional):** adotar um banco de acordes pronto como dependência?

## Decisões que tomei (confira)

- T01: `NoteEditor` recriado por `key={noteId}` em vez de sincronizar por efeito.
- T03: manter o TanStack Query instalado até a T08 decidir.
- T04: remover o botão "Renderizar" (o preview fica automático).
- T06: priorizar contraste AA, mesmo que o botão fique um verde mais escuro que o `#5DAB3C`.
- T09: CSP só em modo report-only nesta rodada.
- T10: sem fallback silencioso. Com API configurada, o erro aparece para o usuário.
