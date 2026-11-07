# State: LeafSound

**Updated:** 2026-11-07

## Current focus

- **Milestone:** v1 MVP (Notion para música com VexFlow)
- **Phase:** 4 — **concluída** (Correções, backlog `docs/TAREFAS.md`, T01–T11)
- **Next:** Fase 5 (Tablatura) ou, antes dela, as decisões em aberto de `docs/PROGRESSO.md` §3 e o checklist manual no navegador (§4)
- **Mode:** yolo (config)

## Session continuity

- **Stopped at:** Backlog de correções (T01–T11) concluído na branch `fix/backlog-correcoes`
- **Resume from:** Decisões do usuário, checklist manual e revisão final da branch; depois `/gsd-next` ou `/gsd-plan-phase 5`

## Project reference

See: `.planning/PROJECT.md`

**Core value:** Estudo musical em um único lugar — texto e notação na mesma nota.

**Estado do código (fonte da verdade):** `docs/PROJETO.md` (visão geral, anterior às correções), `docs/PROGRESSO.md` (o que mudou, decisões e pendências) e `docs/API.md` (contrato da API do backend Go).

## Blockers

- None recorded

## Notes

- Brownfield: Next.js 16 + Editor.js + VexFlow + shadcn-ui + Tailwind 4. O TanStack Query foi removido (T08); a camada de dados é `workspaceService` com `localAdapter`/`apiAdapter` (um modo por build, sem fallback silencioso).
- **Fase 4 (backlog de correções) concluída em 2026-11-07:**
  - O backlog rodou via subagentes (um por tarefa, Sonnet) com revisão independente de requisitos e qualidade; tudo aprovado. Detalhes por tarefa: `docs/PROGRESSO.md` §1.
  - T01–T02: lint 0/0 e CI (GitHub Actions: lint, `tsc`, build, Node 22). T03: camada de dados única. T04–T05: partitura que salva sozinha e dicionário de acordes correto. T06: fontes e paleta verde. T07: favoritos.
  - T08–T09: limpeza de código e dependências; headers de segurança, CSP report-only e `middleware` → `proxy`.
  - T10: adapters local/API, toasts (sonner), badge "Erro ao salvar", Bearer/401/429 no `apiClient`, fila de gravação por nota, rascunhos em memória, `docs/API.md`.
  - T11: sincronização destes documentos (ROADMAP renumerado em 9 fases, REQUIREMENTS com status por requisito).
  - Requisitos entregues: DATA-01, EDIT-01, EDIT-03, EDIT-04, WORK-01, NOTE-01..05, CI-01. SEC-01..SEC-06 parciais. Pendentes: EDIT-02, EDIT-05, NOTE-06, AUTH-01..03, WORK-02, PERF-01..03.
  - `npm run lint` 0 erros e 0 avisos, `npx tsc --noEmit` e `npm run build` passam. **Nada foi testado no navegador** (checklist em `docs/PROGRESSO.md` §4).
- **Git:** PR #1 (T01–T07) mergeado na `main` em 2026-11-04. PR #2 aberto com T08–T11 (branch `fix/backlog-correcoes`).
- **Decisão de processo (minha, o usuário pode mudar):** continuar usando o GSD para as próximas fases, em vez de congelar `.planning/`. As fases 1–3 têm `PLAN.md`; a Fase 4 foi executada pelo fluxo `docs/TAREFAS.md` e não tem arquivos de plano do GSD.

## Next action

1. Responder às decisões de `docs/PROGRESSO.md` §3 e rodar o checklist manual (§4).
2. Revisão final da branch inteira e merge do PR #2.
3. Avançar para a Fase 5 (Tablatura) com `/gsd-next` ou `/gsd-plan-phase 5`. Features fora do backlog que precisam de conversa antes: barra musical (EDIT-05), login real com Clerk (AUTH-01..03).
