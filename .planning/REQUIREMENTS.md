# Requirements: LeafSound

**Defined:** 2026-03-24  
**Core Value:** Estudo musical em um único lugar — texto estruturado e notação (VexFlow) na mesma nota.

## v1 Requirements

### Data & editor contract

- [ ] **DATA-01**: Conteúdo de blocos musicais serializa e desserializa no JSON do Editor.js (`save()` / carga) sem perda de dados essenciais
- [ ] **EDIT-01**: Usuário pode inserir e editar um bloco de **acordes** renderizado com VexFlow
- [ ] **EDIT-02**: Usuário pode inserir e editar um bloco de **tablatura** renderizado com VexFlow
- [ ] **EDIT-03**: Usuário pode inserir e editar um bloco de **partitura (pauta)** renderizado com VexFlow
- [ ] **EDIT-04**: Usuário pode usar blocos de texto existentes (cabeçalho, parágrafo, lista, código) na mesma nota que os blocos musicais

### Workspace e notas

- [ ] **WORK-01**: Usuário acessa um **workspace** (home) listando suas notas com metadados visíveis (título, datas relevantes)
- [ ] **NOTE-01**: Usuário pode **criar** uma nova nota a partir do workspace
- [ ] **NOTE-02**: Usuário pode **abrir** uma nota e editar **título** e **corpo** (blocos)
- [ ] **NOTE-03**: Usuário pode **excluir** uma nota
- [ ] **NOTE-04**: Usuário pode **favoritar** e **desfavoritar** uma nota, com indicação clara na lista
- [ ] **NOTE-05**: Alterações na nota são **persistidas** e reaparecem ao reabrir (mesmo dispositivo / mesma conta conforme fase de auth)

### Autenticação e isolamento

- [ ] **AUTH-01**: Usuário pode **entrar** na aplicação via fluxo Clerk
- [ ] **AUTH-02**: Usuário pode **sair** da aplicação
- [ ] **AUTH-03**: Sessão **persiste** após recarregar a página
- [ ] **WORK-02**: Com usuário autenticado, notas do workspace são **isoladas por usuário** (não vê notas de outros)

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

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| EDIT-01 | Phase 2 | Pending |
| EDIT-02 | Phase 3 | Pending |
| EDIT-03 | Phase 3 | Pending |
| EDIT-04 | Phase 4 | Pending |
| WORK-01 | Phase 4 | Pending |
| NOTE-01 | Phase 4 | Pending |
| NOTE-02 | Phase 4 | Pending |
| NOTE-03 | Phase 4 | Pending |
| NOTE-04 | Phase 4 | Pending |
| NOTE-05 | Phase 5 | Pending |
| AUTH-01 | Phase 5 | Pending |
| AUTH-02 | Phase 5 | Pending |
| AUTH-03 | Phase 5 | Pending |
| WORK-02 | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 15 total  
- Mapped to phases: 15  
- Unmapped: 0 ✓  

---
*Requirements defined: 2026-03-24*  
*Last updated: 2026-03-24 after roadmap creation*
