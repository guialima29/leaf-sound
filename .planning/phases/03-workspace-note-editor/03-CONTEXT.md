# Phase 3: Integração Workspace e NoteEditor Estilo Notion - Context

**Gathered:** 2026-09-24  
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega a integração completa da experiência de edição de notas no estilo **Notion** diretamente dentro da rota `/workspace`.

A barra lateral (`AppSidebar` / `NavWorkspaceTree`) permanece fixa à esquerda, e o painel central renderiza dinamicamente:
1. O editor de notas (`NoteEditor`) quando uma nota está selecionada via `?noteId=...`;
2. A lista em grid de cartões (`NoteCard`) quando nenhuma nota está selecionada, mas existem notas na workspace (sem o card avulso de criar nota no grid);
3. O componente de estado vazio (`EmptyNotes`) quando a workspace não possui nenhuma nota.

**Fora de escopo desta fase:**
- Blocos musicais complexos adicionais (fases posteriores do roadmap).
- Autenticação remota com Clerk e persistência no backend Go (Fase de Auth).
- Colaboração em tempo real.

</domain>

<decisions>
## Implementation Decisions

### 1. Visão Central Condicional do Workspace
- **D-01:** Na página `/workspace`, a renderização do painel central é estritamente orientada pelo estado `noteId`:
  - Se `noteId` estiver ativo: renderiza o componente `<NoteEditor noteId={noteId} />`.
  - Se `!noteId`:
    - Se a workspace atual tiver 0 notas: renderiza `<EmptyNotes onCreateNote={handleCreateNote} />`.
    - Se a workspace tiver notas: renderiza o grid de notas com `<NoteCard />`, com paginação se necessário.
- **D-02:** Remoção do card de criação dentro do grid: O componente `CreateNoteCard` é retirado de dentro da lista de cards, uma vez que a criação rápida já é atendida pelos botões fixos `+ Nota` e `+ Seção` no rodapé da sidebar.
- **D-03:** Clicar no botão "Acessar" de qualquer `NoteCard` seleciona a nota e atualiza a URL para `/workspace?noteId=...`, abrindo-a instantaneamente no editor.

### 2. Remoção do EditorHeader e Limpeza Visual
- **D-04:** O componente `EditorHeader` (com botão de voltar para workspace, logo LeafSound duplicado e lixeira) é completamente removido do fluxo do editor integrado.
- **D-05:** Para permitir ao usuário voltar do editor para o grid de cards de todas as notas, disponibilizar um controle sutil de navegação (ex.: breadcrumb no topo `Workspace > Título da Nota` com link clicável de volta, ou ação discreta de fechar/voltar).

### 3. Título Editável com o Design de TitleWithBar
- **D-06:** O título da nota no topo do editor mantém **fielmente o estilo visual** do `TitleWithBar`:
  - Fonte `font-libre-caslon`, cor `#2B3328`, tamanho de 36px, e a barra horizontal decorativa cinza abaixo (`hr`).
- **D-07:** O título passa a ser um campo de entrada editável inline (input transparente sem bordas visíveis em repouso, focado na digitação natural).
- **D-08:** O título possui limite máximo de **40 caracteres** (`maxLength={40}`), alinhado com o padrão das janelas modais de renomear da sidebar.
- **D-09:** A edição do título atualiza tanto o estado local quanto o `WorkspaceContext` (`renameNote`) e o `storage`, refletindo o novo nome na sidebar e nos cards imediatamente.

### 4. Sincronização de URL e Navegação Snappy
- **D-10:** A seleção de notas na sidebar (`NavWorkspaceTree`) e nas ações rápidas (`SidebarQuickActions`) passa a atualizar o parâmetro de busca `noteId` na rota `/workspace` (ex.: `/workspace?noteId=xyz`) de forma shallow, sem causar refresh da página inteira.
- **D-11:** Se o usuário recarregar a página (F5) ou compartilhar o link, a aplicação mantém aberta a nota identificada no parâmetro `noteId`.
- **D-12:** A rota legada `/editor?id=xyz` passa a redirecionar suavemente para `/workspace?noteId=xyz` para evitar quebras de links antigos.

### 5. Transição entre Notas, Auto-Save e Feedback de Loading
- **D-13:** **Flush de Auto-save:** Quando o usuário estiver digitando na Nota A e clicar na Nota B na sidebar, quaisquer alterações pendentes no debounce da Nota A são salvas imediatamente antes de alternar para a Nota B.
- **D-14:** **Ciclo de vida do Editor.js:** A instância de `TextEditor` deve ser desmontada (`destroy()`) e reinicializada de forma limpa ao trocar de nota (utilizando a chave única `key={noteId}` ou ciclo controlado), evitando vazamento de memória ou conflitos de DOM com o elemento `#editorjs`.
- **D-15:** **Loading Spinner centralizado:** Caso haja latência ou tempo de inicialização dos blocos e scripts do editor, um `Spinner` centralizado é exibido até que os dados estejam prontos.
- **D-16:** **SpinnerBadge:** O indicador discreto de salvamento (`isSaving` e `lastSaved`) é mantido no topo do editor para feedback do usuário ("Salvo", "Salvando...").

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Arquivos Principais da Workspace e Sidebar
- `src/app/workspace/page.tsx` — Página principal da workspace que integrará a sidebar e a alternância entre grid e `NoteEditor`.
- `src/components/app-sidebar.tsx` — Sidebar com estrutura e gatilhos.
- `src/components/nav-workspace-tree.tsx` — Árvore de seções e notas; deve disparar a seleção de notas na workspace em vez de `router.push('/editor')`.
- `src/components/sidebar-quick-actions.tsx` — Botões `+ Nota` e `+ Seção`; criação de nota deve abrir a nova nota diretamente na workspace.
- `src/contexts/workspace-context.tsx` — Gerenciador de estado das workspaces, seções e notas.

### Arquivos do Editor e Visualização
- `src/components/NoteEditor/index.tsx` — Componente que se tornará o container principal do editor integrado.
- `src/components/TextEditor/index.tsx` — Wrapper do Editor.js e registro das tools musicais.
- `src/components/TitleWithBar/index.tsx` — Componente de título com barra estilizada a ser adaptado para edição inline.
- `src/components/SpinnerBadge/index.tsx` — Indicador de status de salvamento.
- `src/components/Pagination/index.tsx` — Visualização em cards de notas e paginação.
- `src/components/EmptyNotes/index.tsx` — Estado vazio de notas da workspace.
- `src/lib/storage.ts` e `src/lib/api/workspace-service.ts` — Persistência de dados das notas.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TitleWithBar`: Já possui a tipografia `font-libre-caslon text-[36px] text-[#2B3328]` e a barra decorativa `hr`. Basta tornar o texto um input com as mesmas classes.
- `SpinnerBadge`: Já fornece visual discreto para exibir "Salvando..." e "Salvo às HH:MM".
- `Spinner`: Componente visual de loading animado já existente em `src/components/Spinner/index.tsx` e `src/components/ui/spinner.tsx`.
- `EmptyNotes`: Já configurado para chamar a ação de criação de notas quando a workspace estiver vazia.

### Established Patterns
- Auto-save com debounce de 5s + flush manual ao desmontar ou trocar de nota.
- ContextMenu na sidebar para renomear e excluir notas.
- `useWorkspace`: Fornece `notes`, `activeWorkspace`, `createNote`, `renameNote`, `deleteNote`.

</code_context>
