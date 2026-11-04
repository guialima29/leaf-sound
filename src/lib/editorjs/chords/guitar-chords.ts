import type { ChordBarre, ChordPosition } from "@/types/editor-music"

// Convenção do VexChords: [corda, casa], corda 1 = Mi agudo, corda 6 = Mi grave,
// "x" = abafada, 0 = solta. Com position 1 e numFrets 5 as casas são absolutas.
// O comentário de cada acorde traz a notação comum, da corda 6 para a 1.
export interface GuitarChordShape {
  chord: ChordPosition[]
  barres?: ChordBarre[]
  position?: number
}

export const GUITAR_CHORDS: Record<string, GuitarChordShape> = {
  C: { chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3], [6, "x"]] }, // x32010
  Cm: {
    chord: [[1, 3], [2, 4], [3, 5], [4, 5], [5, 3], [6, "x"]], // x35543
    barres: [{ fromString: 5, toString: 1, fret: 3 }],
  },
  C7: { chord: [[1, 0], [2, 1], [3, 3], [4, 2], [5, 3], [6, "x"]] }, // x32310
  D: { chord: [[1, 2], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]] }, // xx0232
  Dm: { chord: [[1, 1], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]] }, // xx0231
  D7: { chord: [[1, 2], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]] }, // xx0212
  E: { chord: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]] }, // 022100
  Em: { chord: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]] }, // 022000
  E7: { chord: [[1, 0], [2, 0], [3, 1], [4, 0], [5, 2], [6, 0]] }, // 020100
  F: {
    chord: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]], // 133211
    barres: [{ fromString: 6, toString: 1, fret: 1 }],
  },
  Fm: {
    chord: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]], // 133111
    barres: [{ fromString: 6, toString: 1, fret: 1 }],
  },
  F7: {
    chord: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3], [6, 1]], // 131211
    barres: [{ fromString: 6, toString: 1, fret: 1 }],
  },
  G: { chord: [[1, 3], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]] }, // 320003
  Gm: {
    chord: [[1, 3], [2, 3], [3, 3], [4, 5], [5, 5], [6, 3]], // 355333
    barres: [{ fromString: 6, toString: 1, fret: 3 }],
  },
  G7: { chord: [[1, 1], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]] }, // 320001
  A: { chord: [[1, 0], [2, 2], [3, 2], [4, 2], [5, 0], [6, "x"]] }, // x02220
  Am: { chord: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 0], [6, "x"]] }, // x02210
  A7: { chord: [[1, 0], [2, 2], [3, 0], [4, 2], [5, 0], [6, "x"]] }, // x02020
  B: {
    chord: [[1, 2], [2, 4], [3, 4], [4, 4], [5, 2], [6, "x"]], // x24442
    barres: [{ fromString: 5, toString: 1, fret: 2 }],
  },
  Bm: {
    chord: [[1, 2], [2, 3], [3, 4], [4, 4], [5, 2], [6, "x"]], // x24432
    barres: [{ fromString: 5, toString: 1, fret: 2 }],
  },
  B7: { chord: [[1, 2], [2, 0], [3, 2], [4, 1], [5, 2], [6, "x"]] }, // x21202
}

/** Remove espaços e coloca a primeira letra em maiúscula (am -> Am, g7 -> G7). */
export function normalizeChordName(input: string): string {
  const trimmed = input.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

export interface ResolvedGuitarChord {
  name: string
  chord: ChordPosition[]
  barres: ChordBarre[]
  position: number
}

/**
 * Procura o acorde no dicionário (já normalizando o nome). Devolve uma cópia,
 * para que alterar o bloco não altere o dicionário, ou null se não existir.
 * Não inventa shapes: C#, Db etc. só valem se estiverem em GUITAR_CHORDS.
 */
export function findGuitarChord(input: string): ResolvedGuitarChord | null {
  const name = normalizeChordName(input)
  if (!Object.prototype.hasOwnProperty.call(GUITAR_CHORDS, name)) return null
  const shape = GUITAR_CHORDS[name]
  return {
    name,
    chord: shape.chord.map(([string, fret]) => [string, fret] as ChordPosition),
    barres: (shape.barres ?? []).map((barre) => ({ ...barre })),
    position: shape.position ?? 1,
  }
}
