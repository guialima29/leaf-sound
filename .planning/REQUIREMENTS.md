# Requirements: LeafSound

**Defined:** 2026-03-24  
**Core Value:** Estudo musical em um único lugar — texto estruturado e notação (VexFlow) na mesma nota.

**Escopo do repositório:** este projeto de planejamento e código **leaf-sound** cobre só o **frontend**. O **backend** (API, persistência, regras de isolamento no servidor) será um **serviço separado em Go**; os requisitos abaixo que falam em persistência remota/por usuário descrevem o comportamento **do produto** e a responsabilidade do **cliente** de integrar com essa API — não implicam implementar Go aqui.

## v1 Requirements

### Data & editor contract

- [x] **DATA-01**: Conteúdo de blocos musicais serializa e desserializa no JSON do Editor.js (`save()` / carga) sem perda de dados essenciais
- [x] **EDIT-01**: Usuário pode inserir e editar um bloco de **acordes** renderizado com VexFlow
- [ ] **EDIT-02**: Usuário pode inserir e editar um bloco de **tablatura** renderizado com VexFlow
- [x] **EDIT-03**: Usuário pode inserir e editar um bloco de **partitura (pauta)** renderizado com VexFlow
- [x] **EDIT-04**: Usuário pode usar blocos de texto existentes (cabeçalho, parágrafo, lista, código) na mesma nota que os blocos musicais
- [ ] **EDIT-05**: Na página de edição da nota, o usuário terá uma barra de funcionalidades musicais (ex.: metrônomo, auto-rolagem acompanhando o BPM, acordes fixos na lateral renderizados com VexFlow)

### Workspace e notas

- [x] **WORK-01**: Usuário acessa um **workspace** (home) listando suas notas com metadados visíveis (título, datas relevantes)
- [x] **NOTE-01**: Usuário pode **criar** uma nova nota a partir do workspace
- [x] **NOTE-02**: Usuário pode **abrir** uma nota e editar **título** e **corpo** (blocos)
- [x] **NOTE-03**: Usuário pode **excluir** uma nota
- [x] **NOTE-04**: Usuário pode **favoritar** e **desfavoritar** uma nota, com indicação clara na lista
- [x] **NOTE-05**: Alterações na nota são **persistidas localmente** e reaparecem ao reabrir no mesmo navegador (inclui conteúdo Editor.js com blocos musicais; no modo API as alterações vão para o backend, ver `docs/API.md`)
- [ ] **NOTE-06**: Com usuário autenticado, notas são **persistidas de forma associada à conta** via **API do backend Go** (frontend chama a API; armazenamento no servidor fica fora deste repo)

### Autenticação e isolamento

- [ ] **AUTH-01**: Usuário pode **entrar** na aplicação via fluxo Clerk
- [ ] **AUTH-02**: Usuário pode **sair** da aplicação
- [ ] **AUTH-03**: Sessão **persiste** após recarregar a página
- [ ] **WORK-02**: Com usuário autenticado, notas do workspace são **isoladas por usuário** (não vê notas de outros)

### Qualidade e integração contínua

- [x] **CI-01**: Toda alteração relevante no código passa por **verificação automatizada** antes de integrar (mínimo: `lint` + `build`; quando existirem testes automatizados, incluir no mesmo fluxo). Objetivo: **não regressão** em funcionalidade já entregue.

### Segurança (frontend + alinhamento com API Go)

- [ ] **SEC-01**: **XSS**: conteúdo do editor e qualquer HTML renderizado seguem práticas seguras (evitar `dangerouslySetInnerHTML` sem sanitização; dados de blocos tratados como dados, não HTML confiável).
- [ ] **SEC-02**: **Headers de segurança** aplicáveis no Next.js (ex.: CSP progressiva, `X-Content-Type-Options`, `Referrer-Policy` onde fizer sentido) documentados e configurados sem quebrar VexFlow/Editor.js.
- [ ] **SEC-03**: **Validação de entrada** no cliente (limites de tamanho, tipos) antes de enviar à API; reforço de validação **no backend Go** documentado no contrato (este repo não implementa SQL).
- [ ] **SEC-04**: **SQL injection**: inexistência de SQL no frontend; checklist e contrato de API exigem **queries parametrizadas / camada de acesso** no serviço Go (validação cruzada entre repos).
- [ ] **SEC-05**: **Abuso / DoS / flood**: camada de **rate limiting** e quotas documentadas (edge, API Go, ou CDN); no cliente: debounce, limites de payload e comportamento sob erro **429**.
- [ ] **SEC-06**: **Supply chain**: auditoria de dependências (`npm audit`, atualizações de segurança) e política de secrets (env, nunca commitar chaves).

### Performance e experiência de carregamento

- [ ] **PERF-01**: Metas de **Core Web Vitals** (LCP, INP, CLS) definidas para páginas principais e verificadas em ambiente de produção ou build otimizado.
- [ ] **PERF-02**: Plano de otimização **inspirado em projetos como TabNews** (simplicidade, pouco JS no caminho crítico, cache e estáticos onde possível, streaming/App Router) — sem copiar stack alheia literalmente; priorizar **velocidade percebida** e TTFB.
- [ ] **PERF-03**: **Code splitting** e carregamento tardio de **Editor.js, VexFlow e rotas pesadas**; revisão de bundles e imagens (Next/Image, fontes).

## v2 Requirements

### Produto

- **SRCH-01**: Busca full-text nas notas (título + conteúdo)
- **EXPORT-01**: Exportar nota ou trecho (PDF/imagem dos blocos musicais)
- **THEME-01**: Tema claro/escuro consistente no editor e workspace

### Música avançada

- **MIDI-01**: Reprodução simples de trecho notado (MIDI ou Web Audio)
- **IMPORT-01**: Import parcial MusicXML ou ASCII tab em bloco

## Out of Scope

| Feature | Reason |
|---------|--------|
| Colaboração em tempo real | Fora do escopo acadêmico v1; foco single-user |
| Apps iOS/Android nativos | Web first |
| Editor WYSIWYG de partitura completa (Sibelius-like) | Complexidade; MVP usa entrada simplificada |
| Sincronização offline-first | Depende de estratégia de backend madura |
| Implementação do backend (Go), schema de DB, jobs | **Repositório / projeto Go separado** — fora do escopo deste codebase |

## Traceability

Numeração de fases conforme `.planning/ROADMAP.md` (Fase 4 = backlog de correções `docs/TAREFAS.md`, T01–T11). Status: **Delivered (Fase N / Txx)**, **Partial — o que falta** ou **Pending**.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Delivered (Fase 1) |
| EDIT-01 | Phase 4 | Delivered (Fase 4 / T05: dicionário de acordes e aviso de acorde desconhecido; tool criada na Fase 1) |
| EDIT-02 | Phase 5 | Pending |
| EDIT-03 | Phase 4 | Delivered (Fase 4 / T04: partitura salva sozinha; tool criada na Fase 1) |
| EDIT-04 | Phase 3 | Delivered (Fase 3: blocos de texto e musicais na mesma nota, no `NoteEditor`) |
| EDIT-05 | Phase 5 | Pending (sem fase própria no roteiro original; candidata à Fase 5, precisa de decisão) |
| WORK-01 | Phase 2 | Delivered (Fase 2) |
| NOTE-01 | Phase 2 | Delivered (Fase 2; Fase 4 / T03 unificou a camada de dados) |
| NOTE-02 | Phase 3 | Delivered (Fase 3; Fase 4 / T01 e T03 corrigiram título e carga da nota) |
| NOTE-03 | Phase 2 | Delivered (Fase 2) |
| NOTE-04 | Phase 4 | Delivered (Fase 4 / T07: favoritos na sidebar, editor e grid) |
| NOTE-05 | Phase 2 | Delivered (Fase 2; Fase 4 / T03 e T10: `localStorage` via `localAdapter`) |
| NOTE-06 | Phase 6 | Pending (adapter de API e contrato `docs/API.md` prontos na Fase 4 / T10; falta backend e Clerk) |
| AUTH-01 | Phase 6 | Pending |
| AUTH-02 | Phase 6 | Pending |
| AUTH-03 | Phase 6 | Pending |
| WORK-02 | Phase 6 | Pending |
| CI-01 | Phase 4 | Delivered (Fase 4 / T02: GitHub Actions com lint, `tsc` e build; T09 endureceu o workflow; ainda sem testes automatizados nem regra de branch, Fase 7) |
| SEC-01 | Phase 8 | Partial — nenhuma revisão formal de XSS feita (não há `dangerouslySetInnerHTML` no código e o `innerHTML` das tools só limpa o preview com `""`, mas isso não foi auditado por escrito) |
| SEC-02 | Phase 8 | Partial — Fase 4 / T09: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` e CSP **report-only** (com `connect-src` da API, T10); falta a CSP enforcing validada com VexFlow/Clerk |
| SEC-03 | Phase 8 | Partial — `maxLength` nos campos de título/seção/workspace e limites sugeridos em `docs/API.md` §7; falta validação de payload (tamanho do `content`) no cliente |
| SEC-04 | Phase 8 | Partial — não há SQL no frontend; o contrato `docs/API.md` descreve limites e erros, mas não exige explicitamente queries parametrizadas no Go |
| SEC-05 | Phase 8 | Partial — Fase 4 / T10: mensagem para `429` (toast) e autosave com debounce; falta o plano de rate limit (edge vs Go) e usar `Retry-After` |
| SEC-06 | Phase 8 | Partial — Fase 4 / T09: `npm audit fix`, `.env.example`, CI com permissões mínimas; restam 8 vulnerabilidades moderadas em ferramentas de lint (esperar correção upstream) e actions por tag móvel `@v7` |
| PERF-01 | Phase 9 | Pending |
| PERF-02 | Phase 9 | Pending |
| PERF-03 | Phase 9 | Pending (fontes já via `next/font`, Fase 4 / T06) |

**Coverage:**

- v1 requirements: 27 total
- Delivered: 11 (DATA-01, EDIT-01, EDIT-03, EDIT-04, WORK-01, NOTE-01..05, CI-01)
- Partial: 6 (SEC-01..SEC-06)
- Pending: 10 (EDIT-02, EDIT-05, NOTE-06, AUTH-01..03, WORK-02, PERF-01..03)
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-11-07 — sincronizado com o código após o backlog de correções (Fase 4, T01–T11); EDIT-05 passou a constar na rastreabilidade*
