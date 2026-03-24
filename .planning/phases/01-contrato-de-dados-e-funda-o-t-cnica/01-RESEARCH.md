# Phase 01 — Technical research: contrato Editor.js + VexFlow (spike)

**Phase:** 1 — Contrato de dados e fundação técnica  
**Researched:** 2026-03-24  
**Requirement:** DATA-01

## RESEARCH COMPLETE

## 1. Editor.js custom tools (2.x)

- Tools are **classes** (or objects) registered under `tools` in the Editor config; each has a **string `type`** that appears in saved JSON (`OutputData.blocks[].type`).
- Lifecycle: **`render()`** mounts DOM into the block wrapper; **`save()`** returns the block payload (must be JSON-serializable). **`destroy()`** may clean up listeners/canvas.
- **Dynamic import** of the tool class alongside existing `@editorjs/*` imports keeps the editor bundle smaller and avoids SSR executing browser-only code.
- **Toolbox:** `static get toolbox()` provides label + icon for the “add block” UI (SVG/HTML string for icon is common).

**Implication:** The spike tool must implement `save()` returning `{ schemaVersion, variant, ... }` matching `src/types/editor-music.ts` and read the same shape in `render()` from `this.data`.

## 2. VexFlow 5 no cliente (Next.js)

- Pacote **`vexflow`** expõe ESM/CJS (`import … from 'vexflow'`). Prefer import **apenas em código client** (tool ou `useEffect`), nunca em Server Components puros.
- VexFlow 5 recomenda a **Factory API** para montar sistema + pauta + notas; renderização **SVG** via `renderer: { elementId, width, height }` (alinhado a D-05 no CONTEXT).
- **Fontes:** Bravura/Academico podem exigir `loadFonts` / `setFonts` assíncronos — na spike, seguir o guia oficial (“Getting Started”) e tratar falha com placeholder (D-11).

**Implication:** O plano deve pré-ver loading de fontes; se assíncrono, `render()` pode precisar de async flow ou `requestAnimationFrame` após fonts ready.

## 3. Contrato de dados (DATA-01)

- `OutputData` já é persistido em `Note.content` (`localStorage`). Novos blocos devem usar `type: 'leafMusic_spike'` e `data` compatível com tipos exportados, para **JSON.stringify/parse** idempotente.
- Validação: função guard **`isLeafMusicBlockData`** rejeita `schemaVersion` desconhecido → UI de erro no bloco, não crash global (D-11).

## 4. Riscos

| Risco | Mitigação |
|-------|-----------|
| SSR importa VexFlow | Dynamic import da tool + apenas em `"use client"` tree |
| Fontes atrasadas | Fallback de mensagem “Carregando notação…” ou erro no bloco |
| `save()` não chamado | Testar fluxo: editar → debounce save → reload página |

## Validation Architecture (Nyquist)

- **Automatizado:** `npm run lint` após alterações TS/TSX; `npm run build` antes de considerar a fase fechada (captura erros de tipo/bundle).
- **Manual obrigatório:** abrir `/editor?id=<nota>`, inserir bloco spike, aguardar save, **F5** — bloco reaparece com mesma notação e sem erro de consola no fluxo feliz.
- **Não exigir** teste E2E Playwright nesta fase salvo já existir infra — registrar em VALIDATION.md como manual.

---

*Fim do research — pronto para PLAN.md*
