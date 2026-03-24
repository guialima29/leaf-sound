# Phase 1: Contrato de dados e fundação técnica - Discussion Log

> **Audit trail only.** Decisions are captured in `01-CONTEXT.md`.  
> **Date:** 2026-03-24  
> **Phase:** 1 — Contrato de dados e fundação técnica  
> **Areas discussed:** formato JSON; VexFlow alvo; spike; limites MVP; organização de código; tratamento de erro; escopo vs EDIT-05

---

## 1. Formato do `data` do bloco musical (Editor.js)

| Option | Description | Selected |
|--------|-------------|----------|
| String única codificada | Um único campo string por bloco | |
| Objeto versionado + discriminador | `schemaVersion`, `variant`, payload tipado | ✓ |
| Binário / base64 | Não usar no MVP | |

**User's choice:** Objeto versionado (recomendação técnica alinhada a DATA-01 e evolução futura).  
**Notes:** Namespaced `type` (`leafMusic_*`) para o campo `type` do bloco Editor.js.

---

## 2. VexFlow: SVG vs Canvas

| Option | Description | Selected |
|--------|-------------|----------|
| SVG | DOM, escala, acessibilidade levemente melhor | ✓ |
| Canvas | Pode ser mais rápido em listas enormes | |

**User's choice:** SVG como padrão.  
**Notes:** Revisitar apenas com evidência de performance.

---

## 3. Escopo da spike vs produto

| Option | Description | Selected |
|--------|-------------|----------|
| Bloco genérico `musicSpike` mínimo | Só prova técnica | ✓ |
| Já implementar acorde real | Pertence à Fase 2 (EDIT-01) | |

**User's choice:** Spike mínima com round-trip; acorde produto na Fase 2.

---

## 4. Limites (compassos / notas)

| Option | Description | Selected |
|--------|-------------|----------|
| Enforcement rígido na Fase 1 | Validação máxima já na spike | |
| Documentar orientação MVP; enforcement depois | Caps como guideline + comentários nos tipos | ✓ |

**User's choice:** Documentar limites futuros; sem obrigatoriedade de enforcement na spike salvo planner decidir guard mínimo.

---

## 5. Onde colocar tipos e tools

| Option | Description | Selected |
|--------|-------------|----------|
| `src/types/editor-music.ts` + `src/lib/editorjs/tools/` | Centralizado e escalável | ✓ |
| Tudo inline no TextEditor | Rejeitado — difícil manter | |

**User's choice:** Centralizar tipos e pasta de tools.

---

## 6. Tratamento de dados inválidos

| Option | Description | Selected |
|--------|-------------|----------|
| Quebrar página | Rejeitado | |
| Placeholder de erro no bloco (pt-BR) | Comportamento esperado | ✓ |

**User's choice:** Erro contido no bloco.

---

## 7. EDIT-05 (metrônomo / barra lateral)

**Outcome:** Explicitamente **fora da Fase 1** — nova capacidade; referida em CONTEXT `<deferred>`.

---

## Claude's Discretion

- Ícone toolbox e microcopy exatos da tool spike.  
- Nome exato do primeiro `type` string (`leafMusic_spike` vs variante), desde que namespaced e estável.

## Deferred Ideas

- EDIT-05 (barra musical avançada).  
- MusicXML / MIDI / colaboração (já fora de escopo v1 em PROJECT.md).
