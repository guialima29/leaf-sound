# LeafSound — Progresso do backlog de correções

> Última atualização: 2026-11-03.
> Backlog completo, com os passos de cada tarefa: [`TAREFAS.md`](TAREFAS.md). Visão geral do código **antes** das correções: [`PROJETO.md`](PROJETO.md).

## Resumo

| | |
|---|---|
| Branch | `fix/backlog-correcoes` (criada a partir da `main` em `ab863db`) |
| Concluídas | T01, T02, T03, T04, T05, T06, T07 (7 de 11) |
| Faltam | T08, T09, T10, T11 |
| Push / PR | **Ainda não feitos.** Nada saiu da sua máquina. |
| Testado no navegador | **Não.** Só lint, `tsc` e build. Use o checklist da seção 4. |
| Estado da build | `npm run lint` 0 erros e 0 avisos · `npx tsc --noEmit` ok · `npm run build` ok |

---

## 1. O que foi feito

Cada tarefa foi feita por um subagente (Sonnet) e passou por uma revisão independente de requisitos e qualidade. Todas foram aprovadas sem pontos obrigatórios.

| Tarefa | Commits | O que mudou |
|---|---|---|
| **T01** Lint verde | `033fa93`, `153fb12` | 7 erros de lint corrigidos. `NoteEditor` recriado por `key={noteId}` (lê a nota uma vez). `TitleWithBar` virou um input controlado. Os diálogos de seção são resetados por `key`. Também corrigiu o bug do título que "voltava" enquanto se digitava, e uma renomeação feita pela sidebar atualiza o editor aberto. |
| **T02** CI | `7f39942`, `95b4b7b` | `.github/workflows/ci.yml`: `npm ci` → lint → `tsc` → build, no Node 22, em push para a `main` e em PRs. Badge no README. |
| **T03** Camada de dados única | `0264a09`, `ce30d08` | `lib/storage.ts` e `CardNewNote` apagados. Tudo passa por `workspaceService` (`getNote`, `updateNote`) e pelo contexto (`updateNote`). O grid lê `notes` do contexto e atualiza na hora. O título pendente é salvo ao trocar de nota. Título só com espaços não apaga o anterior. Abrir uma nota direto pela URL mostra "Carregando nota..." ou "Nota não encontrada." |
| **T04** Partitura salva sozinha | `169f5fb` | Digitar notas ou trocar clave/compasso salva via `block.dispatchChange()`. O preview se atualiza sozinho (~400ms) e o botão "Renderizar" foi removido. Mostra os tokens ignorados ("Ignorado: H4/q"). Enter/Backspace/Delete/Tab nos inputs das tools não mexem mais nos blocos. |
| **T05** Acordes | `0a8a5ea` | Dicionário com os 21 acordes corretos (com pestanas) em `src/lib/editorjs/chords/guitar-chords.ts`. Normaliza a entrada (`am` → `Am`). Acorde desconhecido mostra um aviso com o link "Personalizar". O modal lista as cordas de 6 a 1, valida as casas (x ou 0–24), fecha com Esc e isola as teclas do Editor.js. |
| **T06** Fontes e verde | `f1935d4` | `next/font` ligado no layout (Poppins no corpo, Libre Caslon nos títulos). Tokens: `--primary #3B8226`, `--primary-hover #43563B`, `--ring #5DAB3C`, `--foreground #2E332B`. Cores fixas trocadas por tokens. `theme.txt` apagado. |
| **T07** Favoritos | `192f143` | `toggleFavorite` no contexto. Grupo "Favoritos" no topo da sidebar. Item no menu de contexto. Estrela no editor e no card. Favoritas primeiro no grid. Favoritar **não** altera a data de "última atualização". |

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

---

## 2. O que falta

### 2.1 Tarefas do backlog

Os passos detalhados de cada uma estão em [`TAREFAS.md`](TAREFAS.md). Abaixo estão só as **pendências que surgiram durante a execução** e que devem ser somadas a cada tarefa.

**T08 — Remover código não usado** (depende de você responder sobre o `RegisterArea`)
- Também apagar o `EditorHeader`. Na T03 ele foi ajustado só para não importar o `storage`, mas continua sem uso.
- Extrair o menu de contexto da nota (Abrir, Renomear, Mover, Favoritar, Excluir), que hoje está **copiado 3 vezes** em `nav-workspace-tree.tsx`. O "Mover" já diverge entre as cópias.
- Remover a classe `.font-poppins` (provavelmente morta) e os overrides redundantes `bg-primary hover:bg-primary-hover` nos `<Button>` default. A variante `secondary` ficou quase igual à `default`: revisar.
- O `@tanstack/react-query` está sem uso depois da T03. Decidir se remove.

**T09 — Segurança**
- `npm ci` acusa **18 vulnerabilidades** (16 moderadas, 2 altas). Rodar `npm audit` e atualizar.
- `ci.yml`: adicionar `permissions: contents: read`, `timeout-minutes` e `concurrency` com `cancel-in-progress`.
- Conferir, na primeira execução do Actions, se há aviso de deprecação das actions `@v4`.

**T10 — API e contrato**
- **Importante:** com a API ligada, se `GET /api/workspaces/:id/notes` não devolver o `content`, o editor abre a nota vazia e o próximo autosave pode **apagar o conteúdo no servidor**. O contrato em `docs/API.md` precisa exigir notas completas na listagem, ou o editor precisa sempre chamar `getNote` no modo API.
- No modo API, o salvamento ao trocar de nota pode duplicar um PATCH em andamento e chegar fora de ordem.
- `updateNote` com título vazio no modo API pula a API e falha se a nota não estiver no cache local.
- Com a API lenta (> 400ms), o título pode "voltar" por um instante.
- Documentar que `PATCH` só com `isFavorite` **não** deve alterar `updatedAt` no backend Go.

**T11 — Documentos do GSD**
- Marcar como entregues: DATA-01, EDIT-01, EDIT-03, EDIT-04, WORK-01, NOTE-01..05 e CI-01.
- Atualizar o `STATE.md` com este progresso.

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

### 2.3 Fora do backlog (features novas, precisam de conversa antes)

- **Tablatura** (EDIT-02)
- **Login de verdade com Clerk** (AUTH-01..03): hoje o botão de login é só um link
- **Barra musical** (EDIT-05): metrônomo, auto-rolagem, acordes fixos
- Testes automatizados (não existe nenhum)

---

## 3. Decisões que estão com você

1. **T08:** a tela de cadastro (`RegisterArea`) vai ser usada? Se não, apago.
2. **T11:** continuar usando o GSD (`.planning/`) ou congelá-lo e usar `docs/` como referência?
3. **T06 (revisão):** gostou do verde só nas ações e do `#3B8226`? Ou quer a sidebar verde ou o tom original?
4. **Push / PR:** quando quiser, faço o push da branch e abro o PR para a `main`. O CI só roda depois disso.

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

1. `git switch fix/backlog-correcoes` (se não estiver nela) e `git log --oneline main..HEAD` para conferir os 10 commits.
2. Peça ao Claude: *"leia `docs/PROGRESSO.md` e `docs/TAREFAS.md` e continue o backlog a partir da T08"*. Se quiser o mesmo fluxo, use `/superpowers:subagent-driven-development`: um subagente por tarefa, depois uma revisão.
3. Ao montar o prompt de cada tarefa, inclua as pendências da seção 2.1 junto com o texto da tarefa no `TAREFAS.md`.
4. Ao terminar a T11, falta uma **revisão final da branch inteira** (modelo mais forte) antes do PR. Essa revisão também decide quais pontos da seção 2.2 precisam ser corrigidos antes do merge.

O registro detalhado da execução (briefs, relatórios de cada subagente, diffs revisados) fica em `.superpowers/sdd/TAREFAS/`. Essa pasta é ignorada pelo git só na sua máquina (via `.git/info/exclude`): é útil, mas não é versionada. Tudo o que importa dela está resumido aqui.
