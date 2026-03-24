# Stack Research — LeafSound (Notion para música)

**Researched:** 2026-03-24  
**Confidence:** HIGH

## Recommended stack (alinhado ao repositório)

| Camada | Escolha | Rationale |
|--------|---------|-----------|
| Framework | **Next.js 15** (App Router) | Já em uso; SSR/rotas; API Routes para persistência futura |
| UI | **React 19**, **Tailwind CSS 4** | Já configurado |
| Editor de blocos | **Editor.js 2.x** | Já integrado; suporta tools customizadas |
| Notação musical | **VexFlow 5.x** (`vexflow` npm) | Canvas/SVG; tab + stave + chords; TypeScript; release recente (5.0.0) |
| Auth | **Clerk** (`@clerk/nextjs`) | Já no projeto; middleware presente — falta wiring completo no layout |
| Estado servidor (futuro) | **TanStack Query** | Já listado; útil para sync notas após API |
| Persistência MVP | **localStorage** | Já implementado — migrar para DB após modelo multi-usuário |

## O que não usar (por ora)

- **OpenSheetMusicDisplay** como núcleo do editor: foco em *edição* e blocos; OSMD é forte em *display* de MusicXML, menos em UX tipo Notion.
- **Substituir Editor.js por TipTap/ProseMirror** neste marco: aumentaria refactor sem ganho imediato para VexFlow.

## Versões de referência

- `vexflow`: **^5.0.0** (verificar npm no momento do `npm install`)
- `@editorjs/editorjs`: manter linha 2.x já usada no projeto
