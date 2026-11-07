# Contrato da API do LeafSound (backend Go)

Este documento é o que o backend Go precisa implementar para o frontend funcionar em **modo API**. Ele
descreve o que o `src/lib/api/adapters/api-adapter.ts` chama hoje; qualquer divergência deve ser
combinada e ajustada nos dois lados.

## 1. Modos de operação do frontend

O frontend escolhe **um** modo por ambiente, na inicialização, a partir de `NEXT_PUBLIC_API_URL`
(variável embutida no build: mudar o valor exige novo `npm run build`):

| `NEXT_PUBLIC_API_URL` | Modo | Onde os dados ficam |
|---|---|---|
| vazia/ausente | local | `localStorage` do navegador (sem nenhuma chamada de rede) |
| definida (ex.: `https://api.leafsound.app`) | API | somente no backend |

Não existe fallback: no modo API, qualquer erro da API aparece para o usuário (toast em pt-BR e, no
autosave, o estado "Erro ao salvar" do badge) e **nada** é gravado no `localStorage` como plano B. Só o id
do workspace ativo (`leaf-sound-active-workspace-id`) continua local, por ser preferência do navegador.

## 2. Convenções gerais

- Base: `${NEXT_PUBLIC_API_URL}` + caminho (ex.: `http://localhost:8080/api/workspaces`). Sem barra no final.
- Corpo e respostas em JSON UTF-8. Requisições com corpo enviam `Content-Type: application/json`.
- IDs são strings opacas (recomendado UUID v4). O frontend nunca os interpreta.
- Datas `createdAt`/`updatedAt` são **milissegundos desde a época Unix** (número inteiro, UTC).
- **CORS:** liberar a origem do frontend, os métodos `GET, POST, PATCH, DELETE, OPTIONS` e os
  cabeçalhos `Content-Type` e `Authorization`. Responder o preflight (`OPTIONS`) com 204.
- Todas as rotas (exceto `/healthz`, se existir) exigem autenticação (seção 3).
- Todo recurso pertence ao usuário autenticado; acessar recurso de outro usuário deve responder `404`
  (não `403`), para não revelar a existência.

## 3. Autenticação

O `apiClient` aceita um fornecedor de token (`setApiTokenGetter(() => Promise<string | null>)`,
em `src/lib/api/client.ts`). Quando ele devolve um token, toda requisição leva:

```
Authorization: Bearer <token>
```

O fornecedor ainda **não** está ligado ao Clerk (tarefa futura); enquanto isso, nenhuma requisição leva o
cabeçalho. O backend deve validar o JWT (no caso do Clerk, a assinatura via JWKS e a expiração) e
responder:

- `401` token ausente, inválido ou expirado. O frontend redireciona o navegador para `/login`
  (e, se já estiver em `/login`, não redireciona, para não entrar em loop).
- `403` token válido, mas sem permissão para a ação.

## 4. Modelos JSON

### 4.1 `Workspace`

```json
{
  "id": "b7c1...",
  "name": "Principal",
  "description": "Meu workspace principal de estudos",
  "createdAt": 1767225600000,
  "updatedAt": 1767225600000
}
```

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `id` | string | sim | |
| `name` | string | sim | 1 a 30 caracteres (limite da UI) |
| `description` | string | não | até 60 caracteres (limite da UI) |
| `createdAt`, `updatedAt` | number | sim | ms Unix |

### 4.2 `Section`

Sem aninhamento (uma seção nunca contém outra).

```json
{
  "id": "c2d9...",
  "workspaceId": "b7c1...",
  "name": "Estudos de harmonia",
  "order": 0,
  "createdAt": 1767225600000,
  "updatedAt": 1767225600000
}
```

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `id`, `workspaceId` | string | sim | |
| `name` | string | sim | 1 a 40 caracteres, sem espaços nas pontas |
| `order` | number | sim | posição dentro do workspace, a partir de 0; seção nova recebe `quantidade_atual` (vai para o fim) |
| `createdAt`, `updatedAt` | number | sim | ms Unix |

### 4.3 `WorkspaceNote`

```json
{
  "id": "e5f0...",
  "workspaceId": "b7c1...",
  "sectionId": null,
  "title": "Escala de Dó maior",
  "description": "Primeiros compassos da escala",
  "content": { "time": 1767225600000, "version": "2.31.0", "blocks": [ ] },
  "isFavorite": false,
  "createdAt": 1767225600000,
  "updatedAt": 1767225600000,
  "lastUpdateDate": "01/01/2026",
  "lastUpdateTime": "09:00",
  "href": "/workspace?noteId=e5f0..."
}
```

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `id`, `workspaceId` | string | sim | |
| `sectionId` | string \| null | sim | `null` = raiz do workspace ("Notas Gerais") |
| `title` | string | sim | 1 a 40 caracteres, nunca vazio. Notas novas sem título viram `"Sem título"` |
| `description` | string | não | calculada pelo **frontend** (primeiro bloco `paragraph`, sem HTML, até 100 caracteres; ou `"Sem descrição"`) e enviada no PATCH. O backend apenas guarda |
| `content` | `OutputData` | ver 4.4 | conteúdo do Editor.js; ausente/`null` em nota recém-criada |
| `isFavorite` | boolean | não | padrão `false` |
| `createdAt`, `updatedAt` | number | sim | ms Unix |
| `lastUpdateDate` | string | sim | `updatedAt` formatado `dd/mm/aaaa` (pt-BR, fuso `America/Sao_Paulo`) |
| `lastUpdateTime` | string | sim | `updatedAt` formatado `HH:mm` (24 h, mesmo fuso) |
| `href` | string | sim | legado: `"/workspace?noteId=<id>"` |

`lastUpdateDate`, `lastUpdateTime` e `href` são derivados: o backend deve calculá-los a cada resposta.
`lastUpdateDate`/`lastUpdateTime` refletem a **última edição** da nota (ver a regra de `updatedAt` em 5.3):
mover a nota de seção altera `updatedAt`, mas não esses dois campos.

#### Resumo x nota completa (importante)

- `GET /api/workspaces/:id/notes` **pode** devolver **resumos**: os mesmos campos, mas **sem `content`**
  (a listagem só alimenta sidebar e grid, que usam título, descrição, datas, favorito e seção).
- `GET /api/notes/:id` **deve** devolver sempre a nota **completa**, com `content`.
- O frontend, no modo API, sempre chama `GET /api/notes/:id` antes de abrir o editor. Isso é
  obrigatório porque abrir o Editor.js com uma nota sem `content` faria o próximo autosave sobrescrever
  o conteúdo real no servidor com um documento vazio.
- Respostas de `POST`/`PATCH` podem ser completas ou resumos; o frontend mescla campo a campo com o que
  já tem (`{ ...atual, ...resposta }`), então campos ausentes na resposta são preservados. A exceção é o
  `POST` de criação, cuja resposta é usada como a nota/seção inteira (deve vir completa, sem `content`
  no caso de nota recém-criada).

### 4.4 `content`: `OutputData` do Editor.js

```json
{
  "time": 1767225600000,
  "version": "2.31.0",
  "blocks": [
    { "id": "a1", "type": "header", "data": { "text": "Aquecimento", "level": 2 } },
    { "id": "a2", "type": "paragraph", "data": { "text": "Tocar <b>devagar</b>." } },
    { "id": "a3", "type": "list", "data": { "style": "unordered", "items": ["Escala", "Arpejo"] } },
    { "id": "a4", "type": "code", "data": { "code": "C G Am F" } }
  ]
}
```

- Tipos de bloco usados hoje: `header` (apenas `level` 2), `paragraph`, `list`, `code`,
  `leafMusic_partitura` e `leafMusic_acordes`.
- O backend deve tratar `content` como **JSON opaco** (guardar e devolver exatamente o que recebeu, por
  exemplo em coluna `jsonb`). Não rejeitar tipos de bloco desconhecidos nem campos extras: o Editor.js
  e as ferramentas evoluem. O campo `text` dos blocos de texto contém HTML inline (`<b>`, `<i>`, `<a>`...),
  e a sanitização na exibição é responsabilidade do frontend.
- `time` muda a cada salvamento do editor e não deve ser usado para comparar versões.

#### Blocos musicais (`src/types/editor-music.ts`)

Todo bloco musical guarda `data = { schemaVersion: 1, variant, payload }`. Os blocos são validados no
frontend (dado inválido vira o valor padrão). O backend **pode** validar apenas `schemaVersion`
(número inteiro) e `variant`, sem rejeitar versões maiores.

`leafMusic_partitura` (variant `"partitura"`):

```json
{
  "id": "m1",
  "type": "leafMusic_partitura",
  "data": {
    "schemaVersion": 1,
    "variant": "partitura",
    "payload": {
      "notes": "C4/q D4/q E4/q F4/q",
      "clef": "treble",
      "timeSignature": "4/4",
      "width": 500,
      "height": 200
    }
  }
}
```

- `notes`: texto `Nota+Oitava/duração` separado por espaço (`C#4/8`, `Bb3/h`); durações `w h q 8 16 32`.
- `clef`: `"treble"` ou `"bass"`. `timeSignature`: `"4/4"`, `"3/4"` ou `"6/8"`. `width`/`height`: números (px).

`leafMusic_acordes` (variant `"acordes"`):

```json
{
  "id": "m2",
  "type": "leafMusic_acordes",
  "data": {
    "schemaVersion": 1,
    "variant": "acordes",
    "payload": {
      "chords": [
        {
          "name": "G",
          "chord": [[1, 3], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
          "barres": [],
          "position": 1
        }
      ],
      "tuning": ["E", "A", "D", "G", "B", "E"],
      "numFrets": 5,
      "width": 100,
      "height": 120
    }
  }
}
```

- `chord`: pares `[corda, casa]`; corda 1 = Mi agudo; casa `0` = solta, `"x"` = abafada (número ou a string `"x"`).
- `barres` (opcional): `{ "fromString": number, "toString": number, "fret": number }[]`.
- `position` (opcional): casa inicial do diagrama.

## 5. Endpoints

`:id` = id do recurso. `201` em criações, `200` nas demais respostas com corpo, `204` (sem corpo) em exclusões.

### 5.1 Workspaces

| Método e caminho | Corpo | Sucesso | Observações |
|---|---|---|---|
| `GET /api/workspaces` | | `200` `Workspace[]` | só os do usuário |
| `POST /api/workspaces` | `{ "name": string, "description"?: string }` | `201` `Workspace` | |
| `DELETE /api/workspaces/:id` | | `204` | exclui em cascata as seções e notas do workspace |

Recomendação: ao primeiro acesso de um usuário, o backend cria o workspace `"Principal"`. No modo API
o frontend **não** cria workspace padrão sozinho (isso só acontece no modo local).

### 5.2 Seções

| Método e caminho | Corpo | Sucesso | Observações |
|---|---|---|---|
| `GET /api/workspaces/:id/sections` | | `200` `Section[]` | ordenadas por `order` crescente |
| `POST /api/workspaces/:id/sections` | `{ "name": string }` | `201` `Section` | `order` = quantidade atual de seções |
| `PATCH /api/sections/:id` | `{ "name": string }` | `200` `Section` | |
| `DELETE /api/sections/:id?moveNotesToRoot=true\|false` | | `204` | `true` (padrão): as notas da seção passam para `sectionId = null`. `false`: as notas da seção são **excluídas** |

### 5.3 Notas

| Método e caminho | Corpo | Sucesso | Observações |
|---|---|---|---|
| `GET /api/workspaces/:id/notes` | | `200` `WorkspaceNote[]` | resumos permitidos (4.3); ordenadas por `updatedAt` decrescente |
| `POST /api/workspaces/:id/notes` | `{ "title": string, "sectionId": string \| null }` | `201` `WorkspaceNote` | título em branco vira `"Sem título"`; `sectionId` precisa ser do mesmo workspace |
| `GET /api/notes/:id` | | `200` `WorkspaceNote` **completa** | `404` se não existir. O frontend trata 404 como "Nota não encontrada" |
| `PATCH /api/notes/:id` | `{ "title"?, "content"?, "description"?, "isFavorite"? }` | `200` `WorkspaceNote` | ver abaixo |
| `PATCH /api/notes/:id/section` | `{ "sectionId": string \| null }` | `200` `WorkspaceNote` | `null` move para a raiz. Atualiza `updatedAt` e **não** altera `lastUpdateDate`/`lastUpdateTime` (ver abaixo) |
| `DELETE /api/notes/:id` | | `204` | |

#### Datas de atualização (`updatedAt` x `lastUpdateDate`/`lastUpdateTime`)

Esta é a regra que o modo local aplica hoje e que o backend deve reproduzir:

| Operação | `updatedAt` | `lastUpdateDate` / `lastUpdateTime` |
|---|---|---|
| `PATCH /api/notes/:id` com `title`, `content` ou `description` | atualiza | atualizam (formatados a partir do novo `updatedAt`) |
| `PATCH /api/notes/:id` só com `isFavorite` | não muda | não mudam |
| `PATCH /api/notes/:id/section` (mover de seção) | atualiza | **não mudam** (continuam com a data/hora da última edição) |

Ou seja, `lastUpdateDate`/`lastUpdateTime` mostram quando a nota foi editada pela última vez, enquanto
`updatedAt` também é movimentado ao mover a nota (e é o que ordena a listagem).

#### `PATCH /api/notes/:id`

- **Atualização parcial**: campos ausentes não mudam. O frontend envia só o que mudou (o autosave de
  conteúdo manda `content` + `description`; renomear manda só `title`; favoritar manda só `isFavorite`).
- `title`: o frontend nunca envia título vazio (ele é descartado no cliente). O backend deve responder
  `400` para `title` vazio ou só espaços e aplicar `trim` ao salvar.
- `content`: `OutputData` completo (substitui o anterior inteiro; não é um merge de blocos).
- **Regra de `updatedAt`:** um PATCH com **apenas `isFavorite`** (um ou mais campos, todos `isFavorite`)
  **não deve alterar** `updatedAt`, `lastUpdateDate` nem `lastUpdateTime`; favoritar não é edição e não
  pode mudar a ordenação por "última atualização". Se o PATCH tiver qualquer outro campo (`title`,
  `content`, `description`), o backend atualiza `updatedAt` normalmente.
- **Ordem e concorrência:** o frontend serializa os `PATCH /api/notes/:id` e os `GET /api/notes/:id` da
  mesma nota (cada um só sai depois que o anterior da fila terminou) e não reenvia conteúdo idêntico ao último enviado com sucesso. Mesmo assim o
  backend deve ser **idempotente** para o mesmo corpo: reenvios (tentativa manual após erro) são esperados.
  Não é exigido `ETag`/`If-Match` nesta versão.
- Resposta: a nota atualizada (completa ou resumo).

## 6. Erros

Resposta de erro: status HTTP adequado e corpo JSON (recomendado):

```json
{ "error": { "code": "validation_error", "message": "title não pode ser vazio" } }
```

O frontend usa **somente o status** para escolher a mensagem exibida ao usuário (o corpo é guardado no
`ApiError`, mas não aparece na tela), então `message` pode estar em inglês e ser pensada para logs.

| Status | Quando | Comportamento do frontend |
|---|---|---|
| `400` | JSON inválido, campo obrigatório ausente, `title`/`name` vazio | toast "O servidor recusou os dados enviados." |
| `401` | token ausente, inválido ou expirado | redireciona para `/login` (via `window.location.assign`); toast "Sessão expirada. Faça login novamente." |
| `403` | sem permissão | toast "Você não tem permissão para esta ação." |
| `404` | recurso inexistente ou de outro usuário | em `GET /api/notes/:id` mostra "Nota não encontrada."; nas demais, toast "Item não encontrado no servidor." |
| `409` | conflito (opcional: nome duplicado etc.) | toast de erro genérico do servidor |
| `413` | corpo maior que o limite (seção 7) | toast "O conteúdo é grande demais para ser salvo." |
| `422` | dado semanticamente inválido | toast "O servidor recusou os dados enviados." |
| `429` | limite de requisições excedido | toast "Muitas requisições, tente em instantes" |
| `5xx` | erro no servidor | toast "Erro no servidor. Tente novamente em instantes." |
| sem resposta (servidor fora do ar, CORS, rede) | | toast "Não foi possível conectar ao servidor." |
| sem resposta em 15 s | | toast "Tempo esgotado: o servidor demorou demais para responder." |

Em `429`, enviar o cabeçalho `Retry-After` (segundos) é recomendado; o frontend ainda não o usa. Para o
autosave, qualquer erro mantém o conteúdo pendente no navegador e o badge mostra "Erro ao salvar"
com um botão "Tentar novamente"; o próximo salvamento (nova edição, troca de nota ou clique no botão)
reenvia o conteúdo.

Se o salvamento ao **sair** da nota falhar, o frontend mantém o conteúdo/título não salvos em um
rascunho **em memória** (por nota) e os restaura (com o aviso "Restauramos alterações não salvas desta
nota") quando a nota é reaberta, reenviando-os pelo autosave normal. Esse rascunho **não** sobrevive a
recarregar a página ou fechar a aba. Além disso, `GET /api/notes/:id` de uma nota só é emitido depois
que os `PATCH /api/notes/:id` pendentes dessa nota terminam. Essa fila cobre só esses dois tipos de
requisição: `GET /api/workspaces/:id/notes`, `PATCH /api/notes/:id/section` e `DELETE /api/notes/:id`
não entram nela e podem chegar ao backend em paralelo com um `PATCH` da mesma nota.

Se a nota for excluída enquanto há alterações pendentes (ex.: excluir pela sidebar logo depois de
digitar), o salvamento ao sair é descartado, sem aviso e sem rascunho; um `404` nesse salvamento também é
silencioso.

Cada requisição tem tempo limite de **15 s**; ao estourar, o frontend mostra "Tempo esgotado: o servidor
demorou demais para responder." e trata como falha de rede (o conteúdo continua pendente no navegador).
Uma resposta `200` com corpo vazio é tratada como `204`.

## 7. Limites sugeridos

| Item | Limite sugerido | Resposta ao exceder |
|---|---|---|
| Corpo de `PATCH /api/notes/:id` e `POST .../notes` | **1 MB** (a nota inteira cabe em um único `content`) | `413` |
| Corpo das demais requisições | 64 KB | `413` |
| Blocos por nota | 2000 | `422` |
| `title` da nota | 40 caracteres | `400` |
| `name` do workspace | 30 caracteres | `400` |
| `description` do workspace | 60 caracteres | `400` |
| `name` da seção | 40 caracteres | `400` |
| `description` da nota | 100 caracteres | truncar ou `400` |
| Taxa de requisições | ex.: 60 por minuto por usuário (o autosave envia 1 PATCH a cada 3 s de edição) | `429` |

Os limites de caracteres espelham os `maxLength` da interface; o backend deve aplicá-los também (o
frontend não é fonte de confiança).

## 8. Variáveis de ambiente do frontend

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_API_URL` | liga o modo API (ver seção 1). A origem dessa URL é incluída no `connect-src` da política CSP (`next.config.ts`) |

A política CSP está em modo `Content-Security-Policy-Report-Only`: violações só aparecem no console do
navegador; a origem da API já é liberada no `connect-src` (e a política inclui `base-uri 'self'`,
`form-action 'self'` e `object-src 'none'`).

No modo API, as rotas `/` e `/login` não chamam a API: o carregamento de workspaces/notas só acontece
sob `/workspace`.
