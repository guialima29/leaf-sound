# Architecture Research — LeafSound

**Researched:** 2026-03-24

## Componentes principais

1. **Shell Next.js** — `app/layout.tsx`, rotas públicas (`/`) e autenticadas (`/workspace`, `/editor`).
2. **Camada de notas** — hoje `src/lib/storage.ts` (local); evoluir para API + DB com `userId` do Clerk.
3. **Editor** — `TextEditor` + tools Editor.js nativas; **novas tools** encapsulam VexFlow (render em `div`/`canvas` dentro do bloco).
4. **Modelo de dados** — `OutputData` do Editor.js estendido com `type` custom por bloco musical e payload mínimo (ex.: string ABC notation simplificada, ou estrutura `{ strings: [...] }` para tab).

## Fluxo de dados

```text
Usuário → Editor.js → save() → JSON (OutputData) → storage/API → reload → tools re-render VexFlow
```

## Ordem de construção sugerida

1. Contrato de **tool** Editor.js + um bloco musical mínimo (spike).
2. Expandir para três tipos de bloco com serialização estável.
3. Encaixar **lista de notas + favoritos** na UX.
4. **Clerk + persistência** por usuário.
5. Polimento e testes em fluxos críticos.

## Fronteiras

- VexFlow só no **client** (`"use client"`); evitar import pesado no servidor.
- Tamanho do canvas: limitar largura responsiva para não quebrar layout do editor.
