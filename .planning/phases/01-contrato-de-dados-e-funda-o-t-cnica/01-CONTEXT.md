# Phase 1: Contrato de dados e fundação técnica - Context

**Gathered:** 2026-03-24  
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega **apenas** o que o roadmap descreve para a Fase 1: **contrato de dados** para blocos musicais no JSON do Editor.js (`OutputData`), **tipos TypeScript** compartilhados, e uma **tool de spike** que renderiza VexFlow no cliente e **sobrevive** a salvar → recarregar sem corrupção (**DATA-01**).

Não inclui: bloco de acorde “de produto” completo (Fase 2), tab/partitura (Fase 3), workspace/notas (Fase 4), nem barra de ferramentas musicais com metrônomo/auto-scroll (**EDIT-05** em REQUIREMENTS — outra fase).

</domain>

<decisions>
## Implementation Decisions

### Nomes e formato dos blocos no JSON (Editor.js)

- **D-01:** Cada bloco musical usa um `type` string **estável e namespaced**, no padrão `leafMusic_*` (ex.: `leafMusic_spike` na spike; futuras: `leafMusic_chord`, `leafMusic_tab`, `leafMusic_staff`) para evitar colisão com tools nativas e comunidade.
- **D-02:** O campo `data` do bloco é um **objeto JSON versionado** com `schemaVersion: 1` no topo e um discriminador `variant` (`'spike' | 'chord' | 'tab' | 'staff'`) para evolução futura sem migração frágil.
- **D-03:** Dados mínimos da spike: bastam campos que provem round-trip (ex.: `payload` com string de teste ou estrutura mínima que o VexFlow use para desenhar **um** símbolo simples). Não é necessário modelo final de acorde/tab nesta fase.

### VexFlow e renderização

- **D-04:** Renderização **client-only**: tool e VexFlow só em componente/cliente; sem import estático pesado no servidor.
- **D-05:** Alvo de renderização preferencial **SVG** (escala nítida, integração ao DOM do bloco). Reavaliar canvas só se houver problema de performance medido.
- **D-06:** Tamanho do container: largura **responsiva** (100% do content do editor, `max-width` alinhado ao `TextEditor` existente), altura derivada do conteúdo ou mínimo fixo pequeno na spike para não quebrar layout.

### Limites MVP (documentados na Fase 1)

- **D-07:** Registrar por comentário ou doc curta ao lado dos tipos: **limites sugeridos para o MVP** — spike sem obrigação de “máximo de compassos” funcional; para evolução, planejar teto soft (ex.: 4 compassos para tab curta) como **orientação**, não enforcement nesta fase salvo se o planner decidir um guard simples na spike.

### Organização de código

- **D-08:** Tipos compartilhados em **`src/types/editor-music.ts`** (ou `src/types/editor-music/` se ficar grande).
- **D-09:** Implementação da tool de spike em **`src/lib/editorjs/tools/`** (ou `src/components/editor/tools/`) com **export default** compatível com Editor.js; manter o mesmo padrão para as próximas tools musicais.
- **D-10:** Registrar a nova tool no **`TextEditor`** (`src/components/TextEditor/index.tsx`) via objeto `tools`, com **dynamic import** como já feito para Header/List/Code/Paragraph.

### Erros e estados

- **D-11:** Se dados estiverem inválidos ou `schemaVersion` incompatível: renderizar **placeholder de erro** dentro do bloco (mensagem curta em pt-BR), **não** derrubar o editor inteiro.

### Claude's Discretion

- Detalhe exato da API da classe Tool (nomes de métodos, toolbox icon) desde que respeite Editor.js 2.x e o contrato D-01–D-03.
- Escolha entre um único arquivo vs subpastas para a spike, desde que o import no `TextEditor` permaneça limpo.

### Folded Todos

- Nenhum todo foi dobrado nesta fase (`todo match-phase` retornou 0 correspondências).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e planejamento

- `.planning/ROADMAP.md` — Seção "Phase 1: Contrato de dados e fundação técnica" (objetivo, success criteria)
- `.planning/REQUIREMENTS.md` — **DATA-01** (e apenas o necessário para não violar escopo; **EDIT-05** não é escopo desta fase)
- `.planning/PROJECT.md` — Risco Editor.js + VexFlow; restrição client-side

### Código existente a alinhar

- `src/components/TextEditor/index.tsx` — Registro de tools e `holder: "editorjs"`
- `src/lib/storage.ts` — `OutputData` persistido em notas
- `src/app/editor/page.tsx` — Fluxo de carga/salvamento da nota

### Externos (comportamento da lib)

- Documentação Editor.js — BlockTool / custom tools (versão alinhada ao `package.json` do projeto)
- VexFlow 5 — API de entrada mínima para spike (consultar docs oficiais na hora da implementação)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`TextEditor`**: ponto único de configuração de `tools` e lifecycle (destroy no unmount); novas tools musicais entram aqui.
- **`storage.saveNote` / modelo `Note`**: já persiste `content?: OutputData` — o contrato D-01–D-03 deve ser compatível com o que já vai para `localStorage`.

### Established Patterns

- **Dynamic import** de `@editorjs/*` dentro de `useEffect` após mount — replicar para VexFlow e para a classe da tool se necessário evitar SSR.
- **Placeholders em pt-BR** no editor — manter consistência nas mensagens de erro D-11.

### Integration Points

- Rota **`/editor?id=`** carrega nota e passa `initialData` ao editor — spike deve provar save → reload com mesmo `id`.
- **`Note.content`** é o veículo do JSON; nenhuma mudança de modelo além do que já suporta `OutputData` é obrigatória nesta fase.

</code_context>

<specifics>
## Specific Ideas

- Spike deve demonstrar **valor visível** (notação renderizada), não só um retângulo vazio.
- Alinhar visualmente ao **prose** / container já usado no `TextEditor` para não parecer um bloco “estranho” no meio da nota.

</specifics>

<deferred>
## Deferred Ideas

- **EDIT-05** (REQUIREMENTS.md): barra com metrônomo, auto-rolagem BPM, acordes fixos na lateral — **capacidade nova**, pertence a fase dedicada (não Fase 1). Incluir no backlog de roadmap se ainda não estiver mapeada.
- Qualquer **import MusicXML**, **MIDI playback**, ou **colaboração** — fora do escopo já definido em PROJECT.md.

### Reviewed Todos (not folded)

- Nenhum.

</deferred>

---

*Phase: 01-contrato-de-dados-e-funda-o-t-cnica*  
*Context gathered: 2026-03-24*
