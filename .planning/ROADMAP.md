# Roadmap: LeafSound

## Overview

Entregar o **MVP “Notion para música”** no **frontend** (este repositório): fundação de **tools Editor.js + VexFlow**, três blocos musicais (acorde, tab, pauta), **workspace** com notas e favoritos, depois **Clerk** e integração com dados **por usuário** via **API do backend em Go** (projeto separado), **polimento** com **gates de CI** (lint/build por alteração), **hardening de segurança** (XSS, headers, contrato com API, abuso), e **performance** com metas claras e abordagem inspirada em produtos rápidos como **TabNews** (simplicidade, cache, pouco JS crítico). Numeração em **8 fases** (standard estendido).

**Nota de escopo:** implementação do servidor **não** ocorre aqui; a Fase 5 assume consumo de API exposta pelo serviço Go quando disponível (ou mocks/contrato até lá).

## Phases

- [x] **Phase 1: Contrato de dados e fundação técnica** — Padrão de custom tools, tipos TS, spike VexFlow no editor
- [ ] **Phase 2: Bloco de acordes** — Tool completa, render e persistência
- [ ] **Phase 3: Tablatura e partitura** — Duas tools musicais com entrada MVP
- [ ] **Phase 4: Workspace e ciclo de notas** — Lista, CRUD, favoritos, integração com blocos texto+música
- [ ] **Phase 5: Autenticação e isolamento** — Clerk no frontend, chamadas à API Go, persistência por usuário no backend (fora deste repo)
- [ ] **Phase 6: Polimento, qualidade e CI** — UX, a11y, testes críticos; **lint + build obrigatórios** no fluxo de integração (**CI-01**)
- [ ] **Phase 7: Segurança** — XSS, headers, validação de entrada, contrato anti-SQLi com Go, rate limiting/abuso, supply chain
- [ ] **Phase 8: Performance** — Core Web Vitals, otimização de bundle e carregamento (linha TabNews: leveza e cache)

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

### Phase 2: Bloco de acordes
**Goal**: Bloco de acordes utilizável no dia a dia, com UX mínima de edição.

**Depends on**: Phase 1

**Requirements**: EDIT-01

**Success Criteria**:

1. Usuário insere bloco de acorde pelo menu de blocos do editor
2. Acorde renderiza corretamente com VexFlow após reabrir a nota
3. Erros de entrada são tratados sem quebrar a página (fallback ou mensagem)

**Plans**: TBD

**UI hint**: yes

---

### Phase 3: Tablatura e partitura
**Goal**: Tablatura e pauta como blocos separados, com entrada simplificada porém honesta.

**Depends on**: Phase 2

**Requirements**: EDIT-02, EDIT-03

**Success Criteria**:

1. Usuário adiciona bloco de tablatura e vê renderização VexFlow estável
2. Usuário adiciona bloco de partitura (pauta) com trecho curto viável no MVP
3. Ambos persistem no mesmo modelo de `OutputData` definido na Fase 1

**Plans**: TBD

**UI hint**: yes

---

### Phase 4: Workspace e ciclo de notas
**Goal**: Fluxo completo de produto: workspace, lista, criar/editar/excluir, favoritos; blocos texto + música na mesma nota.

**Depends on**: Phase 3

**Requirements**: EDIT-04, WORK-01, NOTE-01, NOTE-02, NOTE-03, NOTE-04, NOTE-05

**Success Criteria**:

1. A partir do workspace, usuário cria nota e abre o editor com título editável
2. Lista mostra favoritos de forma distinguível
3. Excluir nota remove da lista e do armazenamento local (estratégia atual) sem órfãos
4. Parágrafo/cabeçalho/lista/código funcionam junto com blocos musicais na mesma página

**Plans**: TBD

**UI hint**: yes

---

### Phase 5: Autenticação e isolamento
**Goal**: Clerk integrado ao layout; rotas protegidas no **frontend**; cliente chama **API REST (ou similar)** do **backend Go** para CRUD de notas com `userId`/tenant no servidor. Persistência e isolamento **no servidor** são responsabilidade do projeto Go; aqui: integração, tratamento de erros, e migração/estratégia desde `localStorage` quando definida no plano.

**Depends on**: Phase 4

**Requirements**: NOTE-06, AUTH-01, AUTH-02, AUTH-03, WORK-02

**Success Criteria**:

1. Login e logout funcionam; sessão persiste ao recarregar
2. Com API disponível: usuário A não vê notas de usuário B (comportamento garantido pelo backend; frontend valida fluxos e erros)
3. Notas remotas obtidas/persistidas via API Go (sem implementar Go neste repo; mocks aceitáveis até o serviço existir)

**Plans**: TBD

**UI hint**: yes

---

### Phase 6: Polimento, qualidade e CI
**Goal**: Refinos de UX, estados vazios, acessibilidade básica, testes nos fluxos críticos, mitigação de problemas com **muitos blocos VexFlow**; estabelecer que **toda integração** de código passa por **lint + build** (e testes quando existirem) — **CI-01**.

**Depends on**: Phase 5

**Requirements**: CI-01 (e critérios de aceitação globais do MVP já cobertos pelas fases anteriores)

**Success Criteria**:

1. Fluxos críticos (login, criar nota, inserir bloco musical, salvar) têm cobertura automatizada mínima ou checklist UAT documentado
2. Layout responsivo aceitável no editor e na lista
3. Nenhum erro de consola nos fluxos felizes principais
4. **Pipeline ou política de PR** documentada: merges exigem **lint e build verdes** (GitHub Actions, regra de branch, ou equivalente)

**Plans**: TBD (incluir plano de configuração de CI se ainda não existir)

**UI hint**: yes

---

### Phase 7: Segurança
**Goal**: Reduzir superfície de ataque do **frontend** e amarrar **responsabilidades com o backend Go**: XSS, headers de segurança, validação de entrada, **não SQL no cliente** com contrato explícito para SQLi no serviço Go, rate limiting / anti-abuso (edge + API), auditoria de dependências e secrets.

**Depends on**: Phase 6

**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06

**Success Criteria**:

1. Revisão documentada (checklist ou ADR curto) cobrindo XSS no fluxo Editor.js/notas e qualquer renderização HTML
2. Headers relevantes configurados ou justificados (CSP compatível com VexFlow/Clerk)
3. Documento de **contrato de API** ou seção em PROJECT que exige validação e queries seguras no Go
4. Plano de **rate limit / 429** acordado (onde roda: edge vs Go) e UX no cliente
5. `npm audit` / processo de atualização de deps registrado

**Plans**: TBD

**UI hint**: no (há impacto em config e docs)

---

### Phase 8: Performance
**Goal**: Maximizar **velocidade percebida** e métricas objetivas (**Core Web Vitals**), com inspiração nas práticas de projetos como **TabNews** (Filipe Deschamps / comunidade): menos JavaScript no caminho crítico, cache e estáticos agressivos onde fizer sentido no App Router, otimização de fontes/imagens, splitting de Editor+VexFlow.

**Depends on**: Phase 7

**Requirements**: PERF-01, PERF-02, PERF-03

**Success Criteria**:

1. Metas numéricas para LCP/INP/CLS (ou justificativa por rota) registradas e medição reproduzível (Lighthouse CI, Vercel Analytics, ou similar)
2. Documento curto **PERFORMANCE.md** ou seção em PROJECT com decisões (RSC, `loading.tsx`, dynamic imports, cache headers)
3. Bundle analysis ou equivalente (ex.: `@next/bundle-analyzer`) em pelo menos uma iteração para validar splitting

**Plans**: TBD

**UI hint**: no

---

## Progress

**Execution Order:** Phases 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Contrato de dados e fundação técnica | 3/3 | Complete | 2026-03-24 |
| 2. Bloco de acordes | 0/TBD | Not started | - |
| 3. Tablatura e partitura | 0/TBD | Not started | - |
| 4. Workspace e ciclo de notas | 0/TBD | Not started | - |
| 5. Autenticação e isolamento | 0/TBD | Not started | - |
| 6. Polimento, qualidade e CI | 0/TBD | Not started | - |
| 7. Segurança | 0/TBD | Not started | - |
| 8. Performance | 0/TBD | Not started | - |

---
*Roadmap created: 2026-03-24*  
*Last updated: 2026-03-24 — phases 7–8 (security, performance) and CI-01 in phase 6*
