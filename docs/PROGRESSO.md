# LeafSound — Progresso do backlog de correções

> Última atualização: 2026-11-07 (backlog T01–T11 concluído e onda final de correções da revisão).
> Backlog completo, com os passos de cada tarefa: [`TAREFAS.md`](TAREFAS.md). Visão geral do código **antes** das correções: [`PROJETO.md`](PROJETO.md).

## Resumo

| | |
|---|---|
| Branch | `fix/backlog-correcoes` (criada a partir da `main` em `ab863db`) |
| Concluídas | **T01–T11 (11 de 11)** |
| Faltam | Nada no backlog. Restam as decisões da seção 3, o checklist manual (seção 4), a revisão final da branch e o roadmap (Fase 5, tablatura) |
| Push / PR | T01–T07 na `main` pelo PR #1 (mergeado em 2026-11-04). T08–T11 no PR #2, aberto, aguardando merge (branch `fix/backlog-correcoes`). |
| Testado no navegador | **Não.** Só lint, `tsc` e build. Use o checklist da seção 4. |
| Estado da build | `npm run lint` 0 erros e 0 avisos · `npx tsc --noEmit` ok · `npm run build` ok |

---

## 1. O que foi feito

Cada tarefa foi feita por um subagente (Sonnet) e passou por uma revisão independente de requisitos e qualidade. Todas foram aprovadas sem pontos obrigatórios. Os documentos do GSD (`.planning/`) foram sincronizados na T11.

| Tarefa | Commits | O que mudou |
|---|---|---|
| **T01** Lint verde | `033fa93`, `153fb12` | 7 erros de lint corrigidos. `NoteEditor` recriado por `key={noteId}` (lê a nota uma vez). `TitleWithBar` virou um input controlado. Os diálogos de seção são resetados por `key`. Também corrigiu o bug do título que "voltava" enquanto se digitava, e uma renomeação feita pela sidebar atualiza o editor aberto. |
| **T02** CI | `7f39942`, `95b4b7b` | `.github/workflows/ci.yml`: `npm ci` → lint → `tsc` → build, no Node 22, em push para a `main` e em PRs. Badge no README. |
| **T03** Camada de dados única | `0264a09`, `ce30d08` | `lib/storage.ts` e `CardNewNote` apagados. Tudo passa por `workspaceService` (`getNote`, `updateNote`) e pelo contexto (`updateNote`). O grid lê `notes` do contexto e atualiza na hora. O título pendente é salvo ao trocar de nota. Título só com espaços não apaga o anterior. Abrir uma nota direto pela URL mostra "Carregando nota..." ou "Nota não encontrada." |
| **T04** Partitura salva sozinha | `169f5fb` | Digitar notas ou trocar clave/compasso salva via `block.dispatchChange()`. O preview se atualiza sozinho (~400ms) e o botão "Renderizar" foi removido. Mostra os tokens ignorados ("Ignorado: H4/q"). Enter/Backspace/Delete/Tab nos inputs das tools não mexem mais nos blocos. |
| **T05** Acordes | `0a8a5ea` | Dicionário com os 21 acordes corretos (com pestanas) em `src/lib/editorjs/chords/guitar-chords.ts`. Normaliza a entrada (`am` → `Am`). Acorde desconhecido mostra um aviso com o link "Personalizar". O modal lista as cordas de 6 a 1, valida as casas (x ou 0–24), fecha com Esc e isola as teclas do Editor.js. |
| **T06** Fontes e verde | `f1935d4` | `next/font` ligado no layout (Poppins no corpo, Libre Caslon nos títulos). Tokens: `--primary #3B8226`, `--primary-hover #43563B`, `--ring #5DAB3C`, `--foreground #2E332B`. Cores fixas trocadas por tokens. `theme.txt` apagado. |
| **T07** Favoritos | `192f143` | `toggleFavorite` no contexto. Grupo "Favoritos" no topo da sidebar. Item no menu de contexto. Estrela no editor e no card. Favoritas primeiro no grid. Favoritar **não** altera a data de "última atualização". |
| **T08** Limpeza | `e0ac70c`, `fbe4d5c`, `5430c5e` | Apagados os componentes sem uso (`CardBeneficio`, `CardCreateNote`, `CreateNoteCard`, `EditorHeader`, `nav-main`, `nav-projects`), o hook `useDebounce` e as constantes `constBeneficios`, `constNoteCards` e `notesDemo.json`. Removidas as dependências `@shadcn/ui`, `lucide`, `use-debounce`, `react-textarea-autosize`, `cn` e `@tanstack/react-query`. O pacote `cn` **estava** em uso em 9 componentes `ui/`, que agora usam `@/lib/utils`. `QueryProvider` virou `AppProviders`. O menu de contexto da nota agora é um componente único (`note-context-menu.tsx`), usado nas 3 listas, com o "Mover" igual em todas. `RegisterArea` foi mantido. |
| **T09** Segurança | `2eabb73`, `5c15cf1`, `8468a4a`, `1fd95aa` | Headers `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY` e `Permissions-Policy`, mais uma CSP em modo report-only. `middleware.tsx` virou `src/proxy.ts`, como pede o Next 16. Sem a chave do Clerk, o proxy deixa a requisição passar direto (antes, todas as rotas davam 500 no `npm run start`). Criado o `.env.example`. CI: `permissions: contents: read`, timeout de 15 min, `concurrency`, `actions/checkout@v7` e `setup-node@v7`. `npm audit fix` aplicado. |
| **T10** API e contrato | `fe3d0d9`, `89b2508`, `e90bb1e`, `a0dd397`, `2d9bdda` | Adapters `apiAdapter` e `localAdapter`: um modo por build, **sem fallback silencioso**. `ApiError`, `getToken`/Bearer no `apiClient`, 401 redireciona para `/login`, 429 mostra mensagem. Erros visíveis: toasts (sonner) em pt-BR e badge "Erro ao salvar" com "Tentar novamente". Fila de gravação por nota (o GET também entra na fila), rascunhos em memória restaurados ao reabrir a nota. No modo API o editor sempre busca a nota completa com `getNote`. CSP report-only com `connect-src` da API. Criado `docs/API.md` (contrato com o backend Go). |
| **T11** Documentos do GSD | `566fe55` + commit de docs/ | `ROADMAP.md` renumerado em 9 fases (a Fase 4 é este backlog, concluída). `REQUIREMENTS.md` com status por requisito (11 entregues, 6 parciais, 10 pendentes). `STATE.md` e `PROJECT.md` atualizados e apontando para `docs/`. `PROGRESSO.md` e `TAREFAS.md` com T10 e T11 concluídas. |
| **Onda final** (revisão da branch inteira) | `f235285` + commit de docs/ | Excluir a nota aberta logo depois de editar não mostra mais "falha ao salvar" nem deixa rascunho (salvamento ao sair pulado e silencioso; `deleteNote` limpa o rascunho). `WorkspaceProvider` só sob `/workspace` (`/` e `/login` não chamam a API). Mover/renomear mescla a resposta no contexto; salvamento deduplicado não ressuscita `sectionId` antigo. `apiClient`: timeout de 15 s ("Tempo esgotado") e 200 com corpo vazio tratado como 204. CSP com `base-uri`, `form-action` e `object-src`. Toasts sempre claros e `next-themes` removido. `docs/API.md` corrigido (fila por nota, regra de `lastUpdate*` ao mover). |

### Decisões que eu tomei (confira e me diga se quiser mudar)

| Decisão | Por quê | Custo se estiver errada |
|---|---|---|
| Trabalhar numa branch, não numa worktree | Repo limpo, execução sequencial | Nenhum |
| T01: corrigir dentro da própria tarefa a perda de sincronia do título após renomear pela sidebar | A regressão vinha do desenho que eu especifiquei | Um commit a mais |
| T02: Node 22 no CI em vez de 20 | O Node 20 saiu de suporte em abril de 2026, e seu ambiente local é 22 | Trocar uma linha |
| T03: o salvamento ao trocar de nota passa pelo contexto, não direto pelo serviço | Necessário para o grid refletir a edição. O provider fica montado na raiz | Nenhum hoje |
| T05: sem banco de acordes externo | Você não respondeu. Evita dependência nova | Trocar o módulo do dicionário depois |
| T06: verde só nas ações, sidebar neutra | Você não respondeu. Segue o "minimalista" do DESIGN.md | Mudar poucos tokens da sidebar |
| T06: `--primary` = `#3B8226` em vez de `#5DAB3C` | Com `#5DAB3C`, texto branco dá 2.85:1 (reprova). Com `#3B8226`, 4.77:1 (passa no AA) | Ajustar 2 tokens |
| T08: manter o `RegisterArea` | Você não respondeu, e apagar uma tela é a opção menos reversível | Um arquivo morto |
| T08: trocar o pacote `cn` por `@/lib/utils` antes de remover | Fazem a mesma coisa (clsx + tailwind-merge). Fica um mecanismo só | Pequenas diferenças visuais nos `ui/`: conferir no navegador |
| T09: o proxy só usa o Clerk se a chave existir | Sem chave, todas as rotas davam 500. Nenhuma rota é protegida hoje | Quando o login entrar, a chave precisa virar obrigatória |
| T10: modo API sempre busca a nota completa com `getNote` (em vez de exigir `content` na listagem) | Se a listagem vier só com resumo, abrir a nota vazia e salvar apagaria o conteúdo no servidor | Uma chamada a mais por nota aberta |
| T10: rascunhos não salvos ficam só em memória (perdidos ao recarregar a página) | Simplicidade. Persistir no `localStorage` misturaria os dois modos de dados | Perda de texto se a API falhar e a pessoa recarregar |
| T10: um modo por build (`NEXT_PUBLIC_API_URL` define a API), sem fallback para o `localStorage` | O fallback escondia falhas e podia divergir do servidor | Trocar de modo exige novo build |
| T11: continuar usando o GSD (`.planning/`) em vez de congelá-lo | Você não respondeu. Manter o roteiro vivo custa pouco e a Fase 5 já está definida | Congelar `.planning/` com uma nota "histórico" e usar só `docs/` |
| T11: Fase 4 do roadmap = este backlog; as fases antigas 4–8 viraram 5–9 | A numeração antiga era inconsistente entre a lista, os detalhes e a tabela | Renumerar de novo |
| T11: EDIT-05 (barra musical) entra na rastreabilidade como Pendente na Fase 5 | Não tinha fase atribuída | Mover para uma fase própria |
| T11: SEC-01..SEC-06 marcados como Parcial, não como entregue | T09 e T10 entregaram só parte (headers, CSP report-only, audit, 429); falta XSS, CSP enforcing, rate limit etc. | Nenhum |

---

## 2. O que falta

### 2.1 Tarefas do backlog

**Não há tarefas pendentes no backlog (T01–T11 concluídas).** As pendências que surgiram durante a execução foram resolvidas nas próprias tarefas ou estão na tabela 2.2.

### 2.2 Pontos pequenos sem tarefa definida

Não bloqueiam nada. Podem virar uma tarefa de "polimento" ou entrar quando alguém mexer no arquivo.

| Área | Ponto |
|---|---|
| Partitura | Um token inválido "vaza" a duração para a nota seguinte (`H4/h C4` faz o C4 virar mínima). A causa é `lastDuration`, atribuído antes da validação do nome em `parseNotesString`. |
| Partitura | Uma duração desconhecida (`C4/x`) vira semínima sem aparecer em "Ignorado". |
| Partitura | A mensagem "Ignorado" não tem `aria-live`. Campo vazio agora salva `""` em vez das notas padrão (intencional). |
| Acordes | O modal não tem `role="dialog"`, `aria-modal`, focus trap nem devolve o foco. Enquanto está aberto, engole atalhos globais (Ctrl+Z etc.). |
| Acordes | Depois de salvar pelo link "Personalizar", o input principal continua com o nome desconhecido. |
| Acordes | "Casa inicial" > 1 com casas absolutas desenha fora do diagrama (`numFrets: 5`). Já acontecia antes. |
| Visual | Ainda há verdes claros fixos em `HomeFeatures` (`#aaf789`, `#cef5bd`) e `#fafafa` em `HomeHowWorks`. |
| Visual | O contorno de foco `#5DAB3C` a 50% fica abaixo do contraste 3:1 (WCAG 1.4.11). Sugestão: `--ring` = `--primary`. |
| Visual | `--card-foreground` e `--popover-foreground` continuam quase pretos, enquanto `--foreground` é `#2E332B`. O `.dark` não tem `--primary-hover`. |
| Visual | `NoteCard`: o `CardTitle` usa `line-clamp-1` e `flex` ao mesmo tempo. Conferir se o título trunca. |
| Editor | O título no input pode manter espaços no fim até a nota ser reaberta (no armazenamento já fica sem espaços). |
| Dados | `readList` não tem `try/catch` no `JSON.parse`: um `localStorage` corrompido gera uma exceção. |
| Dados | `toggleFavorite` lê `notes` da closure. Um duplo clique muito rápido pode perder o segundo toggle. |
| UI | `Pagination`: a página atual não é corrigida depois do ajuste (clamp). O diálogo de renomear seção perdeu a animação de saída. `use-mobile` cria um `matchMedia` a cada leitura. |
| UI (T08) | O submenu de "Mover" das notas na raiz agora se chama "Mover para..." (antes "Mover para Seção"). Conferir no navegador os 9 componentes `ui/` que passaram do pacote `cn` para `@/lib/utils` (sidebar, tooltip, avatar, skeleton, sheet etc.). |
| Limpeza (T08) | `tailwind.config.js` não tem efeito no Tailwind 4 (não há `@config`), mas não foi apagado. Componentes `ui/` sem uso, mantidos: `breadcrumb`, `input-group` e `textarea`. |
| Segurança (T09) | 8 vulnerabilidades **moderadas** de `npm audit`, todas em ferramentas de lint (`minimatch` via `typescript-eslint` e `eslint-config-next`). Só seriam resolvidas com downgrade de major. Esperar uma correção upstream. |
| Segurança (T09) | O proxy decide se usa o Clerk **na hora do build** (as `NEXT_PUBLIC_*` são embutidas no build). Quando o login entrar, a chave precisa ser obrigatória. As actions do CI usam a tag móvel `@v7`, não um SHA fixo. |
| API (T10) | O título que falhou ao salvar só é re-tentado pelo botão do badge ou ao sair. Um PATCH de título em andamento que falha depois de sair da nota guarda o rascunho, mas não mostra toast. |
| API (T10) | O toggle de favorito sem rede empilha toasts (sem `id`). |
| API (T10) | Erros permanentes (400/413/422) mantêm o rascunho para sempre. Um 401 durante o flush de saída perde o rascunho (recarga). |
| API (T10) | Eco tardio do título com a API lenta (> 400ms) não resolvido (documentado). |
| API (T10) | Modo API sem workspace padrão: se o backend devolver `[]`, não há workspace ativo (`docs/API.md` recomenda o backend criar "Principal"). |

### 2.3 Fora do backlog (features novas, precisam de conversa antes)

- **Tablatura** (EDIT-02)
- **Login de verdade com Clerk** (AUTH-01..03): hoje o botão de login é só um link
- **Barra musical** (EDIT-05): metrônomo, auto-rolagem, acordes fixos
- Testes automatizados (não existe nenhum)

---

## 3. Decisões que estão com você

1. **T08 (já decidido por mim, pode mudar):** o `RegisterArea` foi mantido. Se não for usar, é só apagar `src/components/RegisterArea/`.
2. **T11 (já decidido por mim, pode mudar):** continuar usando o GSD. O `.planning/` foi sincronizado com o código. Se preferir congelá-lo, é só marcá-lo como "histórico" e usar `docs/` como fonte da verdade.
3. **T06 (revisão):** gostou do verde só nas ações e do `#3B8226`? Ou quer a sidebar verde ou o tom original?
4. **Push / PR:** PR #2 com T08–T11, aberto, aguardando merge. Falta só o merge por você (depois da revisão final); depois, apagar a branch `fix/backlog-correcoes`. O CI roda no PR.

---

## 4. Checklist de teste manual (pendente)

Antes de começar, faça um backup do `localStorage` (DevTools → Application → Local Storage → copiar as chaves `leaf-sound-*`). Depois rode `npm run dev`.

**Notas e editor (T01, T03)**
- [ ] Criar 2 notas. Digitar na 1, trocar para a 2 em menos de 3s e voltar: o texto está lá. Recarregar a página e conferir de novo.
- [ ] Digitar o título rápido por ~2s: nenhuma letra some. Trocar de nota logo depois de digitar o título: o título fica salvo.
- [ ] Renomear a nota aberta pela sidebar: o título do editor muda na hora.
- [ ] Editar uma nota, clicar em "Ver todas as notas": o card mostra a descrição e a data novas.
- [ ] "Criar Anotação" no grid: a nota aparece na sidebar na hora.
- [ ] "+ Seção" abre vazio. "Renomear seção" abre com o nome atual.

**Partitura (T04)**
- [ ] Digitar `E4/h G4/h`, esperar 3s sem clicar em nada, recarregar: a partitura continua lá.
- [ ] Enter dentro do input não cria um bloco novo. `H4/q` aparece em "Ignorado".

**Acordes (T05)**
- [ ] `Am`, `F`, `Bm`, `G7` desenham o formato certo.
- [ ] `Xyz` mostra o aviso. "Personalizar" abre o modal com o nome preenchido.
- [ ] No modal, `abc` numa corda mostra erro. Esc fecha. Tab e Delete não afetam o editor.

**Visual (T06)**
- [ ] Os títulos estão em Libre Caslon e o texto em Poppins (DevTools → Computed → font-family).
- [ ] Os botões principais estão verdes, e o hover fica num verde mais escuro. A sidebar continua neutra.

**Favoritos (T07)**
- [ ] Favoritar pelo menu, pela estrela do editor e conferir o card. O grupo "Favoritos" aparece na sidebar.
- [ ] Recarregar: o favorito continua. A data "Last update" do card **não** mudou por causa do favorito.

---

## 5. Como continuar depois

1. `git switch fix/backlog-correcoes` (se não estiver nela) e `git log --oneline main..HEAD` para conferir os commits que ainda não estão na `main`.
2. Responda às decisões da seção 3 e rode o **checklist manual** da seção 4 no navegador (nada foi testado lá ainda). Anote o que falhar.
3. Faça a **revisão final da branch inteira** (modelo mais forte) antes do merge do PR #2. Ela também decide quais pontos da seção 2.2 precisam ser corrigidos antes do merge.
4. Depois, siga o roadmap: **Fase 5 (Tablatura)** em `.planning/ROADMAP.md`, com `/gsd-next` ou `/gsd-plan-phase 5`. Features que precisam de conversa antes: barra musical (EDIT-05) e login real com Clerk (AUTH-01..03).
5. Para o estado do código e do planejamento, veja `docs/PROJETO.md` (antes das correções), este arquivo, `docs/API.md` e `.planning/STATE.md`.

O registro detalhado da execução (briefs, relatórios de cada subagente, diffs revisados) fica em `.superpowers/sdd/TAREFAS/`. Essa pasta é ignorada pelo git só na sua máquina (via `.git/info/exclude`): é útil, mas não é versionada. Tudo o que importa dela está resumido aqui.
