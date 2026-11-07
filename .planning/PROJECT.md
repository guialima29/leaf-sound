# LeafSound

## What This Is

**LeafSound** é um aplicativo web de anotações no estilo Notion, voltado a músicos e estudantes de música: cada pessoa tem um **workspace** onde cria **notas** com blocos de texto ricos e blocos **musicais** (acordes, tablatura e pauta) renderizados com **VexFlow**. O foco é simplicidade em relação ao Notion completo, com diferencial claro na notação musical embutida no editor.

**Escopo deste repositório:** apenas o **frontend** (Next.js). O **backend** é um **projeto separado**, escrito em **Go**, e não faz parte do código deste workspace.

**Estado do código (referências atuais):** [`docs/PROJETO.md`](../docs/PROJETO.md) (visão geral do código, escrita antes do backlog de correções), [`docs/PROGRESSO.md`](../docs/PROGRESSO.md) (o que mudou desde então, decisões e pendências) e [`docs/API.md`](../docs/API.md) (contrato da API do backend Go). Em caso de divergência, vale o código e esses documentos, não o texto antigo do `.planning/`.

## Core Value

O usuário consegue **escrever estudo musical em um único lugar**: texto estruturado (títulos, listas, código) **e** notação musical editável na mesma nota, sem trocar de ferramenta.

## Requirements

### Validated

- ✓ **Aplicação Next.js com página inicial de apresentação** — existente
- ✓ **Editor de blocos Editor.js** (cabeçalho, parágrafo, lista, código) na rota do editor — existente
- ✓ **Persistência local de notas** (`localStorage`, modelo `Note` com `OutputData`) — existente; hoje via `localAdapter` (Fase 4 / T03, T10)
- ✓ **Contrato de dados dos blocos musicais no JSON do Editor.js** (DATA-01) — Fase 1
- ✓ **Workspaces, seções e sidebar de notas** (WORK-01, NOTE-01, NOTE-03, NOTE-05) — Fase 2
- ✓ **NoteEditor no workspace, título inline, texto e música na mesma nota** (NOTE-02, EDIT-04) — Fase 3
- ✓ **Bloco de acordes** (EDIT-01) e **bloco de partitura** (EDIT-03) com VexFlow, salvando sozinhos — Fase 4 / T04, T05
- ✓ **Favoritos** (NOTE-04) — Fase 4 / T07
- ✓ **CI**: lint + `tsc` + build no GitHub Actions (CI-01) — Fase 4 / T02, T09
- ✓ **Camada de dados única**, com adapters local/API sem fallback silencioso, erros visíveis e contrato em `docs/API.md` — Fase 4 / T03, T10
- ✓ **Fontes via `next/font` e paleta verde com tokens** — Fase 4 / T06
- ✓ **Headers de segurança e CSP report-only**, `middleware` → `proxy` — Fase 4 / T09
- ✓ **Middleware Clerk** e hooks de auth no repositório — parcial (o proxy só usa o Clerk se a chave existir; o layout ainda não envolve `ClerkProvider` de forma completa)

### Active

- [ ] Bloco de **tablatura** integrado ao Editor.js com VexFlow (EDIT-02) e **barra musical** (EDIT-05)
- [ ] Autenticação end-to-end (Clerk) no frontend e integração com **API do backend Go** para dados de nota **por usuário** (o adapter de API e o contrato `docs/API.md` já existem; falta Clerk real e backend)
- [ ] UX polida: estados vazios, acessibilidade básica nos blocos musicais, testes automatizados (não existe nenhum)
- [ ] **CI**: expandir para testes e regra de branch exigindo o check (o workflow de lint + `tsc` + build já existe)
- [ ] **Segurança** (parcial): revisão de XSS, CSP enforcing, validação de payload, plano de rate limit, contrato com API Go (SQLi) — headers e CSP report-only já feitos
- [ ] **Performance**: metas tipo Core Web Vitals e otimização no estilo **TabNews** (leveza, cache, pouco JS crítico)

### Out of Scope (v1)

- **Implementação do servidor/backend neste repositório** — backend em **Go** em repo/pasta separada; aqui só cliente web
- Colaboração em tempo real e comentários — complexidade alta; foco em single-player
- App mobile nativo — web primeiro
- Playback de áudio MIDI integrado — pode entrar em milestone futuro
- Import/export MusicXML completo — deferido salvo spike explícito no roadmap

## Context

- **Projeto acadêmico** em evolução: código Next.js 16, React 19, Tailwind 4, `@editorjs/*`, VexFlow 5, `@clerk/nextjs`, shadcn-ui e sonner (toasts). O TanStack Query foi removido na Fase 4 / T08.
- **Arquitetura alvo:** frontend (este repo) ↔ API REST/JSON (ou similar) exposta pelo **backend em Go** (outro repositório). O frontend pode usar rotas BFF/`app/api` do Next só como proxy ou utilitários, mas a **lógica de domínio e persistência** fica no serviço Go.
- **Idioma da UI:** português (pt-BR) já usado em placeholders e datas.
- **Risco técnico principal:** integrar VexFlow (canvas/SVG) com o ciclo de vida do Editor.js (mount/unmount, `save()`/JSON) sem perda de dados.
- **Processo:** objetivo é que **toda atualização** relevante seja validada automaticamente (**CI-01**); fases posteriores cobrem **segurança** e **performance** de forma explícita no roadmap.

## Constraints

- **Stack (frontend):** manter Next.js e Editor.js como base; VexFlow como biblioteca de notação (versão 5.x no npm).
- **Backend:** linguagem e deploy do serviço de API — **Go**, fora deste repositório; contrato HTTP (OpenAPI ou documento equivalente) acordado entre os dois projetos quando a integração for feita.
- **Escopo acadêmico:** roadmap deve ser executável em iterações curtas; priorizar MVP vertical (uma nota com um bloco musical funcionando) antes de recursos colaterais.
- **Compatibilidade:** renderização client-side para VexFlow; atenção a SSR/hidratação no App Router.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Editor em blocos (Editor.js) | Alinha ao modelo Notion e já está no projeto | ✓ Good |
| VexFlow para notação | Padrão em JS para pauta/tab; comunidade ativa | ✓ Good (acordes e partitura entregues; tablatura pendente) |
| Clerk para auth | Já dependência do projeto | — Pending (integração completa, Fase 6) |
| Backend em Go, repositório separado | Separação clara de responsabilidades; API consumida pelo frontend | — Pending (contrato em `docs/API.md` pronto; backend e integração real na Fase 6) |
| Segurança em camadas | Front: XSS/headers/validação; Go: SQLi, rate limit, dados | — Parcial (headers e CSP report-only na Fase 4; resto na Fase 8) |
| Performance inspirada em TabNews-like | CWV, bundle, cache, pouco JS no critical path | — Pending (Fase 9) |
| Correções viraram a Fase 4 do roteiro (backlog `docs/TAREFAS.md`, T01–T11) | Estabilizar o MVP local antes de novas features; uma tarefa por commit, executadas por subagentes com revisão | ✓ Good (concluída em 2026-11-07) |
| Um modo de dados por build (local ou API), sem fallback silencioso (T10) | Falha da API aparece ao usuário em vez de esconder perda de dados | ✓ Good |
| Modo API sempre busca a nota completa com `getNote` (T10) | A listagem pode vir só com resumo; abrir a nota vazia e salvar apagaria o conteúdo no servidor | ✓ Good |
| Rascunhos não salvos ficam em memória, perdidos ao recarregar (T10) | Simplicidade; persistir rascunhos no `localStorage` fica para depois | — Pending (revisar se a perda incomodar) |
| Node 22 no CI (T02) | Node 20 saiu de suporte em abril de 2026 | ✓ Good |
| Verde só nas ações, sidebar neutra; `--primary` = `#3B8226` (T06) | Segue o "minimalista" do DESIGN.md; `#5DAB3C` com texto branco reprova no AA (2.85:1), `#3B8226` passa (4.77:1) | — Pending (confirmação do usuário) |
| Proxy só usa o Clerk se a chave existir (T09) | Sem a chave, todas as rotas davam 500 no `npm run start` | — Pending (a chave vira obrigatória quando o login entrar) |
| `RegisterArea` mantido (T08) | Apagar uma tela é a opção menos reversível | — Pending (decisão do usuário) |
| Continuar usando o GSD após o backlog (T11) | Decisão do controller (o usuário não respondeu): manter `.planning/` sincronizado | — Pending (o usuário pode mudar) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-07 after Phase 4 (backlog de correções, T01–T11): itens entregues movidos para Validated, decisões do backlog registradas e referências ao estado do código (`docs/`) adicionadas*
