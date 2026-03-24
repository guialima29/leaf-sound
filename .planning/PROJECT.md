# LeafSound

## What This Is

**LeafSound** é um aplicativo web de anotações no estilo Notion, voltado a músicos e estudantes de música: cada pessoa tem um **workspace** onde cria **notas** com blocos de texto ricos e blocos **musicais** (acordes, tablatura e pauta) renderizados com **VexFlow**. O foco é simplicidade em relação ao Notion completo, com diferencial claro na notação musical embutida no editor.

## Core Value

O usuário consegue **escrever estudo musical em um único lugar**: texto estruturado (títulos, listas, código) **e** notação musical editável na mesma nota, sem trocar de ferramenta.

## Requirements

### Validated

- ✓ **Aplicação Next.js com página inicial de apresentação** — existente
- ✓ **Editor de blocos Editor.js** (cabeçalho, parágrafo, lista, código) na rota do editor — existente
- ✓ **Persistência local de notas** (`localStorage`, modelo `Note` com `OutputData`) — existente
- ✓ **Middleware Clerk** e hooks de auth no repositório — parcial (layout ainda não envolve `ClerkProvider` de forma completa)

### Active

- [ ] Blocos musicais (acorde, tablatura, partitura) integrados ao Editor.js com VexFlow
- [ ] Workspace por usuário com lista de notas, favoritos e fluxo criar/editar/excluir
- [ ] Autenticação end-to-end (Clerk) com dados de nota **por usuário** em backend ou estratégia clara de persistência
- [ ] UX polida: salvamento confiável, estados vazios, acessibilidade básica nos blocos musicais

### Out of Scope (v1)

- Colaboração em tempo real e comentários — complexidade alta; foco em single-player
- App mobile nativo — web primeiro
- Playback de áudio MIDI integrado — pode entrar em milestone futuro
- Import/export MusicXML completo — deferido salvo spike explícito no roadmap

## Context

- **Projeto acadêmico** em evolução: já existe código Next.js 15, React 19, Tailwind, `@editorjs/*`, `@clerk/nextjs`, TanStack Query.
- **Idioma da UI:** português (pt-BR) já usado em placeholders e datas.
- **Risco técnico principal:** integrar VexFlow (canvas/SVG) com o ciclo de vida do Editor.js (mount/unmount, `save()`/JSON) sem perda de dados.

## Constraints

- **Stack:** manter Next.js e Editor.js como base; VexFlow como biblioteca de notação (versão 5.x no npm).
- **Escopo acadêmico:** roadmap deve ser executável em iterações curtas; priorizar MVP vertical (uma nota com um bloco musical funcionando) antes de recursos colaterais.
- **Compatibilidade:** renderização client-side para VexFlow; atenção a SSR/hidratação no App Router.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Editor em blocos (Editor.js) | Alinha ao modelo Notion e já está no projeto | ✓ Good |
| VexFlow para notação | Padrão em JS para pauta/tab; comunidade ativa | — Pending |
| Clerk para auth | Já dependência do projeto | — Pending (integração completa) |

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
*Last updated: 2026-03-24 after initialization (GSD new-project / brownfield planning)*
