# Roadmap: LeafSound

## Overview

Entregar o **MVP “Notion para música”** no **frontend** (este repositório): fundação de **tools Editor.js + VexFlow**, três blocos musicais (acorde, tab, pauta), **workspace** com notas e favoritos, depois **Clerk** e integração com dados **por usuário** via **API do backend em Go** (projeto separado), **polimento** com **gates de CI** (lint/build por alteração), **hardening de segurança** (XSS, headers, contrato com API, abuso), e **performance** com metas claras e abordagem inspirada em produtos rápidos como **TabNews** (simplicidade, cache, pouco JS crítico). Numeração em **9 fases** (standard estendido; a Fase 4 foi o backlog de correções `docs/TAREFAS.md`, ver abaixo).

**Nota de escopo:** implementação do servidor **não** ocorre aqui; a Fase 6 assume consumo de API exposta pelo serviço Go quando disponível (ou mocks/contrato até lá; o contrato está em `docs/API.md`).

## Phases

- [x] **Phase 1: Contrato de dados e fundação técnica** — Padrão de custom tools, tipos TS, spike VexFlow no editor
- [x] **Phase 2: Sistema de Workspaces, Seções e Sidebar de Notas** — WorkspaceSwitcher, seções não-aninhadas, botões rápidos, ContextMenu e Drag & Drop
- [x] **Phase 3: Integração Workspace e NoteEditor Estilo Notion** — NoteEditor no centro do Workspace, remoção do EditorHeader, título editável inline, navegação snappy
- [x] **Phase 4: Correções (backlog docs/TAREFAS.md)** — Lint verde, CI, camada de dados única, partitura e acordes corrigidos, fontes/paleta, favoritos, limpeza, headers de segurança, erros da API visíveis e documentos sincronizados (T01–T11)
- [ ] **Phase 5: Tablatura** — Tool de tablatura com entrada MVP (EDIT-02)
- [ ] **Phase 6: Autenticação e isolamento** — Clerk no frontend, chamadas à API Go, persistência por usuário no backend (fora deste repo)
- [ ] **Phase 7: Polimento, qualidade e CI** — UX, a11y, testes críticos; **lint + build obrigatórios** no fluxo de integração (**CI-01** já entregue na Fase 4; aqui entram testes e regra de branch)
- [ ] **Phase 8: Segurança** — XSS, headers, validação de entrada, contrato anti-SQLi com Go, rate limiting/abuso, supply chain (parcialmente adiantada na Fase 4)
- [ ] **Phase 9: Performance** — Core Web Vitals, otimização de bundle e carregamento (linha TabNews: leveza e cache)

## Phase Details

### Phase 1: Contrato de dados e fundação técnica
**Goal**: Estabelecer como blocos musicais vivem no `OutputData` e provar render VexFlow dentro de uma tool Editor.js.

**Depends on**: Nothing (first phase)

**Requirements**: DATA-01

**Success Criteria** (what must be TRUE):

1. Existe documentação ou tipos compartilhados para `type` e `data` dos blocos musicais no JSON do Editor.js
2. Uma tool de spike renderiza VexFlow no cliente e sobrevive a um ciclo salvar → recarregar sem corrupção do JSON
3. Decisão registrada sobre limites de entrada (tamanho, compassos) para MVP

**Plans**: 3 plans — `01-01-PLAN.md` (deps + tipos), `01-02-PLAN.md` (tool VexFlow), `01-03-PLAN.md` (registro + estilos + verificação manual)

**UI hint**: yes

---

### Phase 2: Sistema de Workspaces, Seções e Sidebar de Notas
**Goal**: Sistema de Workspaces e Seções sincronizado com backend/local, com criação/troca no switcher, seções de notas (profundidade 1), botões rápidos no footer (+Nota, +Seção), ContextMenu (shadcn-ui) e Drag and Drop.

**Depends on**: Phase 1

**Requirements**: WORK-01, NOTE-01, NOTE-03, NOTE-05

**Success Criteria**:

1. WorkspaceSwitcher permite alternar e criar workspaces dinamicamente
2. Seções organizam notas sem permitir aninhamento (profundidade máxima de 1 nível)
3. Botões "+ Nota" e "+ Seção" acima do NavUser realizam criação ágil
4. Clique com botão direito exibe ContextMenu com ações de renomear, mover para seção e excluir
5. Notas podem ser arrastadas para dentro e para fora de seções com feedback visual imediato

**Plans**: `02-01-PLAN.md`

**UI hint**: yes

---

### Phase 3: Integração Workspace e NoteEditor Estilo Notion
**Goal**: Experiência integrada estilo Notion na rota `/workspace`: sidebar à esquerda com seleção de notas que carrega dinamicamente o `NoteEditor` no centro, remoção do header antigo (`EditorHeader`), título editável inline preservando estilo `TitleWithBar`, flush imediato no save ao alternar notas, navegação snappy por URL (`?noteId=`) e visão condicional com grid de cards/estado vazio quando nenhuma nota estiver selecionada.

**Depends on**: Phase 2

**Requirements**: NOTE-02, EDIT-04

**Success Criteria**:

1. Clicar em uma nota na sidebar (`NavWorkspaceTree`) ou no grid abre a nota imediatamente no `NoteEditor` no centro de `/workspace`
2. `EditorHeader` antigo é removido, mantendo `SpinnerBadge` e título editável inline com limite de 40 caracteres (`TitleWithBar`)
3. Alternância entre notas realiza flush/salvamento imediato de alterações pendentes e exibe spinner de carregamento durante a montagem
4. Rota `/workspace` sem nota selecionada exibe `EmptyNotes` (se 0 notas) ou grid de cards sem o card de criação avulso
5. URL reflete a nota ativa (`/workspace?noteId=...`) e rota legada `/editor?id=...` redireciona para o workspace

**Plans**: 2 plans (concluídos) — `03-01-PLAN.md` (NoteEditor, TitleWithBar editável e ciclo de vida) e `03-02-PLAN.md` (Integração na `/workspace`, sidebar, cards e rotas)

**UI hint**: yes

---

### Phase 4: Correções (backlog docs/TAREFAS.md)
**Goal**: Estabilizar o MVP local antes de novas features: lint/build verdes com CI, camada de dados única, blocos de partitura e acordes corretos, favoritos, paleta e fontes do DESIGN.md, remoção de código morto, headers de segurança, erros da API visíveis (sem fallback silencioso) e documentos de planejamento sincronizados com o código. Fase **fora do roteiro original**, criada a partir do diagnóstico em `docs/PROJETO.md` e executada por subagentes com revisão (uma tarefa por commit).

**Depends on**: Phase 3

**Requirements**: EDIT-01, EDIT-03, NOTE-04, CI-01 (SEC-01..SEC-06 avançaram só em parte; ver REQUIREMENTS.md)

**Success Criteria** (what must be TRUE):

1. `npm run lint` com 0 erros e 0 avisos, `tsc --noEmit` e `npm run build` passam, e o CI (GitHub Actions) roda os três em push e PR (T01, T02)
2. Uma única camada de dados (`workspaceService` + contexto); `lib/storage.ts` removido (T03)
3. Partitura salva sem clicar em "Renderizar" e acordes com dicionário correto e aviso de acorde desconhecido (T04, T05)
4. Fontes via `next/font` e paleta verde com tokens (T06); favoritos na sidebar, no editor e no grid (T07)
5. Código e dependências sem uso removidos (T08); headers de segurança, CSP report-only e `proxy.ts` (T09)
6. Adapters local/API sem fallback silencioso, erros visíveis (toast, badge "Erro ao salvar") e contrato em `docs/API.md` (T10)
7. `.planning/` e `docs/` descrevem o estado real do código (T11)

**Plans**: 11 tarefas (T01–T11) descritas em `docs/TAREFAS.md`; progresso, decisões e pendências em `docs/PROGRESSO.md` (sem arquivos `PLAN.md` do GSD)

**UI hint**: yes

---

### Phase 5: Tablatura
**Goal**: Tool de **tablatura** (EDIT-02) no Editor.js com VexFlow e entrada MVP, seguindo o padrão das tools de acordes e partitura (`src/lib/editorjs/tools/`, tipos em `src/types/editor-music.ts`). A **barra musical** (EDIT-05: metrônomo, auto-rolagem, acordes fixos) é a candidata natural a esta fase ou a uma própria, e precisa de conversa antes.

**Depends on**: Phase 4

**Requirements**: EDIT-02, EDIT-05

**Success Criteria** (what must be TRUE):

1. Usuário insere e edita um bloco de tablatura renderizado com VexFlow na mesma nota que texto, acordes e partitura
2. O bloco salva sozinho (sem botão de renderizar) e sobrevive a salvar → recarregar sem perda de dados
3. Entradas inválidas são sinalizadas (como em acordes e partitura) e os limites de tamanho do contrato de dados são respeitados

**Plans**: TBD

**UI hint**: yes

---

### Phase 6: Autenticação e isolamento
**Goal**: Clerk integrado ao layout; rotas protegidas no **frontend**; cliente chama **API REST (ou similar)** do **backend Go** para CRUD de notas com `userId`/tenant no servidor. Persistência e isolamento **no servidor** são responsabilidade do projeto Go; aqui: integração, tratamento de erros, e migração/estratégia desde `localStorage` quando definida no plano. **Já existe** (T10): contrato em `docs/API.md`, adapter de API com `getToken`/Bearer no `apiClient`, 401 → `/login` e erros visíveis; falta o Clerk real (hoje o login é só um link) e o backend.

**Depends on**: Phase 5

**Requirements**: NOTE-06, AUTH-01, AUTH-02, AUTH-03, WORK-02

**Success Criteria**:

1. Login e logout funcionam; sessão persiste ao recarregar
2. Com API disponível: usuário A não vê notas de usuário B (comportamento garantido pelo backend; frontend valida fluxos e erros)
3. Notas remotas obtidas/persistidas via API Go (sem implementar Go neste repo; mocks aceitáveis até o serviço existir)

**Plans**: TBD

**UI hint**: yes

---

### Phase 7: Polimento, qualidade e CI
**Goal**: Refinos de UX, estados vazios, acessibilidade básica, testes nos fluxos críticos, mitigação de problemas com **muitos blocos VexFlow**; estabelecer que **toda integração** de código passa por **lint + build** (e testes quando existirem) — **CI-01**.

**Depends on**: Phase 6

**Requirements**: nenhum novo (CI-01 entregue na Fase 4 / T02 com lint + `tsc` + build; aqui entram testes automatizados e regra de branch; critérios de aceitação globais do MVP já cobertos pelas fases anteriores)

**Success Criteria**:

1. Fluxos críticos (login, criar nota, inserir bloco musical, salvar) têm cobertura automatizada mínima ou checklist UAT documentado
2. Layout responsivo aceitável no editor e na lista
3. Nenhum erro de consola nos fluxos felizes principais
4. **Pipeline ou política de PR** documentada: merges exigem **lint e build verdes** (o workflow do GitHub Actions já existe desde a Fase 4; falta a regra de branch exigindo o check e incluir testes quando existirem)

**Plans**: TBD (o workflow de CI já existe)

**UI hint**: yes

---

### Phase 8: Segurança
**Goal**: Reduzir superfície de ataque do **frontend** e amarrar **responsabilidades com o backend Go**: XSS, headers de segurança, validação de entrada, **não SQL no cliente** com contrato explícito para SQLi no serviço Go, rate limiting / anti-abuso (edge + API), auditoria de dependências e secrets.

**Depends on**: Phase 7

**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06

**Success Criteria**:

1. Revisão documentada (checklist ou ADR curto) cobrindo XSS no fluxo Editor.js/notas e qualquer renderização HTML
2. Headers relevantes configurados ou justificados (CSP compatível com VexFlow/Clerk)
3. Documento de **contrato de API** ou seção em PROJECT que exige validação e queries seguras no Go
4. Plano de **rate limit / 429** acordado (onde roda: edge vs Go) e UX no cliente
5. `npm audit` / processo de atualização de deps registrado

**Progresso adiantado na Fase 4** (T09, T10): headers `nosniff`/`Referrer-Policy`/`X-Frame-Options`/`Permissions-Policy` e CSP em modo **report-only** (com `connect-src` da API), `npm audit fix` e `.env.example`, `docs/API.md` com limites sugeridos e erros, mensagem para `429` no cliente. Falta: revisão de XSS, promover a CSP a enforcing (compatível com VexFlow/Clerk), plano de rate limit (edge vs Go), validação de payload no cliente e as 8 vulnerabilidades moderadas de `npm audit` (ferramentas de lint).

**Plans**: TBD

**UI hint**: no (há impacto em config e docs)

---

### Phase 9: Performance
**Goal**: Maximizar **velocidade percebida** e métricas objetivas (**Core Web Vitals**), com inspiração nas práticas de projetos como **TabNews** (Filipe Deschamps / comunidade): menos JavaScript no caminho crítico, cache e estáticos agressivos onde fizer sentido no App Router, otimização de fontes/imagens, splitting de Editor+VexFlow.

**Depends on**: Phase 8

**Requirements**: PERF-01, PERF-02, PERF-03

**Success Criteria**:

1. Metas numéricas para LCP/INP/CLS (ou justificativa por rota) registradas e medição reproduzível (Lighthouse CI, Vercel Analytics, ou similar)
2. Documento curto **PERFORMANCE.md** ou seção em PROJECT com decisões (RSC, `loading.tsx`, dynamic imports, cache headers)
3. Bundle analysis ou equivalente (ex.: `@next/bundle-analyzer`) em pelo menos uma iteração para validar splitting

**Plans**: TBD

**UI hint**: no

---

## Progress

**Execution Order:** Phases 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Contrato de dados e fundação técnica | 3/3 | Complete | 2026-03-24 |
| 2. Sistema de Workspaces, Seções e Sidebar de Notas | 1/1 | Complete | 2026-09-24 |
| 3. Integração Workspace e NoteEditor Estilo Notion | 2/2 | Complete | 2026-09-25 |
| 4. Correções (backlog docs/TAREFAS.md) | 11/11 tarefas | Complete | 2026-11-07 |
| 5. Tablatura | 0/TBD | Not started | - |
| 6. Autenticação e isolamento | 0/TBD | Not started | - |
| 7. Polimento, qualidade e CI | 0/TBD | Not started | - |
| 8. Segurança | 0/TBD | Not started | - |
| 9. Performance | 0/TBD | Not started | - |

---
*Roadmap created: 2026-03-24*
*Last updated: 2026-11-07 — renumerado em 9 fases: a Fase 4 passou a ser o backlog de correções (T01–T11, concluído); tablatura, auth, polimento, segurança e performance viraram as Fases 5–9*
