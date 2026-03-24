# Roadmap: LeafSound

## Overview

Entregar o **MVP “Notion para música”** no **frontend** (este repositório): fundação de **tools Editor.js + VexFlow**, três blocos musicais (acorde, tab, pauta), **workspace** com notas e favoritos, depois **Clerk** e integração com dados **por usuário** via **API do backend em Go** (projeto separado), e por fim **polimento** e qualidade. A numeração segue granularidade **standard** (6 fases coerentes).

**Nota de escopo:** implementação do servidor **não** ocorre aqui; a Fase 5 assume consumo de API exposta pelo serviço Go quando disponível (ou mocks/contrato até lá).

## Phases

- [ ] **Phase 1: Contrato de dados e fundação técnica** — Padrão de custom tools, tipos TS, spike VexFlow no editor
- [ ] **Phase 2: Bloco de acordes** — Tool completa, render e persistência
- [ ] **Phase 3: Tablatura e partitura** — Duas tools musicais com entrada MVP
- [ ] **Phase 4: Workspace e ciclo de notas** — Lista, CRUD, favoritos, integração com blocos texto+música
- [ ] **Phase 5: Autenticação e isolamento** — Clerk no frontend, chamadas à API Go, persistência por usuário no backend (fora deste repo)
- [ ] **Phase 6: Polimento e qualidade** — UX, a11y básico, testes críticos, performance

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

### Phase 6: Polimento e qualidade
**Goal**: Refinos de UX, estados vazios, acessibilidade básica, testes nos fluxos críticos, mitigação de problemas de performance com vários blocos VexFlow.

**Depends on**: Phase 5

**Requirements**: (cobertura de aceitação global do MVP; sem novos REQ-IDs obrigatórios)

**Success Criteria**:

1. Fluxos críticos (login, criar nota, inserir bloco musical, salvar) têm cobertura automatizada mínima ou checklist UAT documentado
2. Layout responsivo aceitável no editor e na lista
3. Nenhum erro de consola nos fluxos felizes principais

**Plans**: TBD

**UI hint**: yes

---

## Progress

**Execution Order:** Phases 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Contrato de dados e fundação técnica | 0/3 | Planned | - |
| 2. Bloco de acordes | 0/TBD | Not started | - |
| 3. Tablatura e partitura | 0/TBD | Not started | - |
| 4. Workspace e ciclo de notas | 0/TBD | Not started | - |
| 5. Autenticação e isolamento | 0/TBD | Not started | - |
| 6. Polimento e qualidade | 0/TBD | Not started | - |

---
*Roadmap created: 2026-03-24*
