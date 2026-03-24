# Features Research — LeafSound

**Researched:** 2026-03-24

## Table stakes (esperado no produto)

- Conta e sessão estável (login/logout, persistência de sessão)
- Workspace único por usuário como “home” das notas
- CRUD de notas: criar, abrir, renomear/título, editar corpo, excluir
- Indicador de salvamento e lista com datas
- Favoritar notas para acesso rápido
- Blocos de texto: título, parágrafo, lista, código (já parcialmente atendido)

## Diferenciais (core do produto)

- Menu/bloco “+” ou slash com opções **musicais**:
  - **Acordes** — símbolos ou diagramas (acorde fretted conforme escopo)
  - **Tablatura** — linhas de tab com notas editáveis (MVP: poucos compassos)
  - **Partitura** — pauta (trecho curto; entrada pode ser simplificada no v1)
- Renderização consistente na leitura e no PDF/export (v2 se não couber no v1)

## Anti-features / deferir

- Real-time colaboração
- Bases de dados e wiki avançada tipo Notion
- Biblioteca de samples de áudio

## Dependências entre features

- Schema JSON dos blocos musicais → deve existir antes de sync multi-dispositivo
- Auth + modelo por usuário → antes de tratar workspace como “oficial” na nuvem
