/**
 * Contrato JSON para blocos musicais no Editor.js (OutputData).
 *
 * Dois blocos disponíveis: Partitura (VexFlow) e Acordes (VexChords).
 */

export const LEAF_MUSIC_SCHEMA_VERSION = 1 as const

export type LeafMusicVariant = "partitura" | "acordes"

export interface LeafMusicPartituraPayload {
  notes: string
  clef: string
  timeSignature: string
  width: number
  height: number
}

export interface ChordString {
  string: number
  fret: number | 'x'
  label?: string
}

export type ChordPosition = [number, number | string]

export interface ChordBarre {
  fromString: number
  toString: number
  fret: number
}

export interface LeafMusicAcordesPayload {
  chords: Array<{
    name: string
    chord: ChordPosition[]
    barres?: ChordBarre[]
    position?: number
  }>
  tuning: string[]
  numFrets: number
  width: number
  height: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export interface LeafMusicPartituraData {
  schemaVersion: typeof LEAF_MUSIC_SCHEMA_VERSION
  variant: "partitura"
  payload: LeafMusicPartituraPayload
}

export function createDefaultLeafMusicPartituraData(): LeafMusicPartituraData {
  return {
    schemaVersion: LEAF_MUSIC_SCHEMA_VERSION,
    variant: "partitura",
    payload: {
      notes: "C4/q D4/q E4/q F4/q",
      clef: "treble",
      timeSignature: "4/4",
      width: 500,
      height: 200
    }
  }
}

export function isLeafMusicPartituraData(data: unknown): data is LeafMusicPartituraData {
  if (!isRecord(data)) return false
  if (data.schemaVersion !== LEAF_MUSIC_SCHEMA_VERSION) return false
  if (data.variant !== "partitura") return false
  if (!isRecord(data.payload)) return false
  const payload = data.payload as unknown as LeafMusicPartituraPayload
  return typeof payload.notes === "string" && typeof payload.clef === "string"
}

export interface LeafMusicAcordesData {
  schemaVersion: typeof LEAF_MUSIC_SCHEMA_VERSION
  variant: "acordes"
  payload: LeafMusicAcordesPayload
}

export function createDefaultLeafMusicAcordesData(): LeafMusicAcordesData {
  return {
    schemaVersion: LEAF_MUSIC_SCHEMA_VERSION,
    variant: "acordes",
    payload: {
      chords: [],
      tuning: ["E", "A", "D", "G", "B", "E"],
      numFrets: 5,
      width: 100,
      height: 120
    }
  }
}

export function isLeafMusicAcordesData(data: unknown): data is LeafMusicAcordesData {
  if (!isRecord(data)) return false
  if (data.schemaVersion !== LEAF_MUSIC_SCHEMA_VERSION) return false
  if (data.variant !== "acordes") return false
  if (!isRecord(data.payload)) return false
  const payload = data.payload as unknown as LeafMusicAcordesPayload
  return Array.isArray(payload.chords)
}
