/**
 * Contrato JSON para blocos musicais no Editor.js (OutputData).
 *
 * MVP (fases futuras): tablatura curta costuma ficar em ~4 compassos para desempenho;
 * partituras longas podem ser segmentadas. Estes são limites **orientativos**, não
 * enforcement obrigatório na spike (D-07).
 */

export const LEAF_MUSIC_SCHEMA_VERSION = 1 as const

/** Nome da tool no registro Editor.js — deve coincidir com a chave em `tools`. */
export const LEAF_MUSIC_BLOCK_TYPE_SPIKE = "leafMusic_spike" as const

export type LeafMusicVariant = "spike" | "chord" | "tab" | "staff"

export interface LeafMusicSpikePayload {
  demo: string
}

/**
 * Dados persistidos no bloco Editor.js (`data`) para a spike musical.
 */
export interface LeafMusicSpikeData {
  schemaVersion: typeof LEAF_MUSIC_SCHEMA_VERSION
  variant: "spike"
  payload: LeafMusicSpikePayload
}

export function createDefaultLeafMusicSpikeData(): LeafMusicSpikeData {
  return {
    schemaVersion: LEAF_MUSIC_SCHEMA_VERSION,
    variant: "spike",
    payload: { demo: "spike-v1" },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function isLeafMusicSpikeData(data: unknown): data is LeafMusicSpikeData {
  if (!isRecord(data)) return false
  if (data.schemaVersion !== LEAF_MUSIC_SCHEMA_VERSION) return false
  if (data.variant !== "spike") return false
  if (!isRecord(data.payload)) return false
  const demo = data.payload.demo
  return typeof demo === "string"
}
