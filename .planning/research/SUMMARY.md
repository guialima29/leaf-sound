# Project Research Summary

**Project:** LeafSound  
**Domain:** Productivity + music notation (web)  
**Researched:** 2026-03-24  
**Confidence:** HIGH

## Executive Summary

LeafSound combina **Editor.js** (blocos) com **VexFlow 5** para entregar um “Notion enxuto” focado em música. O repositório já tem Next.js 15, Tailwind, persistência local, Editor.js básico e dependências Clerk — o trabalho central é **tools customizadas** com serialização confiável e, em seguida, **auth + dados por usuário**. A ordem recomendada é: fundação técnica dos blocos musicais → completar os três tipos de bloco → produto (workspace + notas + favoritos) → Clerk e backend → polimento.

## Key Findings

### Recommended Stack

- Manter **Next.js + Editor.js + VexFlow 5**; completar **Clerk** no layout e rotas protegidas.
- Persistência: começar do que existe (**localStorage**), planejar API + DB na fase de contas.

### Table Stakes vs Differentiators

- **Table stakes:** login estável, lista de notas, favoritos, edição confiável.
- **Differentiators:** blocos de acorde, tab e pauta no mesmo editor que o texto.

### Critical Pitfalls

1. Perda de dados entre `save()`/`render()` das tools — testar ciclos completos.
2. SSR/hidratação — manter VexFlow estritamente no cliente.

## Implications for Roadmap

- **Fase 1–2:** Arquitetura de tools + primeiro bloco musical; depois acordes estáveis.
- **Fase 3:** Tab + pauta com entrada MVP.
- **Fase 4:** Workspace e notas (incluindo favoritos).
- **Fase 5:** Clerk + isolamento de dados.
- **Fase 6:** Qualidade e UX.

---

*Synthesized: 2026-03-24*
