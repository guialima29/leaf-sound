# Pitfalls Research — LeafSound

**Researched:** 2026-03-24

## 1. Dessincronia Editor.js ↔ VexFlow

**Sinais:** bloco vazio após navegar; duplicar notas; `save()` truncando dados.  
**Prevenção:** implementar `save()`/`render()` oficiais da tool; testar destroy/remount; validar JSON na carga.  
**Fase:** 1–3

## 2. Hidratação / SSR

**Sinais:** mismatch de HTML; erro ao acessar `window`/`document`.  
**Prevenção:** dynamic import de Editor.js e VexFlow apenas no cliente; placeholder estável no SSR.  
**Fase:** 1

## 3. Complexidade de entrada musical

**Sinais:** usuário não consegue editar tab rápido.  
**Prevenção:** MVP com entrada simples (textarea estruturado ou poucos campos) antes de WYSIWYG completo.  
**Fase:** 3

## 4. Escopo de auth

**Sinais:** notas “somem” ao trocar de estratégia de storage.  
**Prevenção:** definir migração de `localStorage` → usuário logado uma única vez (script ou export/import).  
**Fase:** 5

## 5. Performance com muitos blocos VexFlow

**Sinais:** scroll lenton na nota longa.  
**Prevenção:** lazy render ou virtualização na lista de notas; re-render do VexFlow só no bloco alterado.  
**Fase:** 6
