# State: LeafSound

**Updated:** 2026-09-23

## Current focus

- **Milestone:** v1 MVP (Notion para música com VexFlow)
- **Phase:** 2 — **em execução / concluída** (Sistema de Workspaces, Seções e Sidebar de Notas)
- **Mode:** yolo (config)

## Session continuity

- **Stopped at:** Fase 2 implementada (WorkspaceSwitcher dinâmico, seções sem aninhamento, botões rápidos, ContextMenu e Drag & Drop)
- **Resume from:** Verificação e testes da Fase 2

## Project reference

See: `.planning/PROJECT.md`

**Core value:** Estudo musical em um único lugar — texto e notação na mesma nota.

## Blockers

- None recorded

## Notes

- Brownfield: Next.js + Editor.js + TanStack Query + shadcn-ui + Tailwind.
- **Arquitetura:** Workspaces e Seções com persistência híbrida (API backend Go + fallback local em `localStorage`).
- **Sidebar:** `WorkspaceSwitcher` dinâmico, árvore de notas com seções (profundidade 1), botões rápidos no footer e drag and drop nativo.

## Next action

Executar verificação automatizada (`npm run lint` e `npm run build`) e validar os fluxos no navegador.

