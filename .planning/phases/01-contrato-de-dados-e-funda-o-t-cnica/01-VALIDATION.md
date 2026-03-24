---
phase: 01
slug: contrato-de-dados-e-funda-o-t-cnica
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-24
---

# Phase 01 — Validation Strategy

> Contrato de dados + spike VexFlow: verificação mista (lint/build + manual no browser).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | ESLint (Next.js preset) |
| **Config file** | `eslint.config.mjs` / projeto Next |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~1–3 min (depende da máquina) |

---

## Sampling Rate

- **After every task commit:** `npm run lint`
- **After last plan wave:** `npm run build`
- **Before `/gsd-verify-work`:** lint + build verdes + checklist manual abaixo

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| Types + deps | 01-01 | 1 | DATA-01 | lint | `npm run lint` | ⬜ |
| Tool spike | 01-02 | 2 | DATA-01 | lint + manual | lint + steps §Manual | ⬜ |
| Wire + docs limits | 01-03 | 3 | DATA-01 | lint + build + manual | `npm run build` + steps §Manual | ⬜ |

---

## Wave 0 Requirements

- Infra de teste E2E **não** é obrigatória nesta fase.
- *Existing infrastructure:* `npm run lint` / `npm run build` cobrem TypeScript e bundle.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|---------------|------------|-------------------|
| Round-trip nota com bloco musical | DATA-01 | Editor.js + DOM + VexFlow | 1) `npm run dev` 2) Abrir `/editor` com nota existente ou criar via app 3) Adicionar bloco “Spike musical” (ou nome da toolbox) 4) Esperar autosave / salvar 5) F5 — bloco presente, notação visível, sem erro vermelho no bloco |
| Erro contido (opcional) | D-11 | Forçar `schemaVersion` inválido só se o plano incluir devtool/test | Apenas se task previr payload inválido |

---

## Validation Sign-Off

- [ ] Lint verde após implementação
- [ ] Build verde
- [ ] Manual round-trip executado
- [ ] Limites MVP documentados nos tipos (sucesso roadmap crit. 3)

**Approval:** pending
