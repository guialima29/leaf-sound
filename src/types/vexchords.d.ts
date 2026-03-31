declare module 'vexchords' {
  export interface ChordBoxOptions {
    width?: number
    height?: number
    circleRadius?: number
    numStrings?: number
    numFrets?: number
    showTuning?: boolean
    defaultColor?: string
    bgColor?: string
    strokeColor?: string
    fretWidth?: number
    stringWidth?: number
    labelColor?: string
    titleFont?: string
    subtitleFont?: string
  }

  export interface ChordData {
    chord: Array<[number, number | string]>
    barres?: Array<{ fromString: number; toString: number; fret: number }>
    position?: number
    tuning?: string[]
  }

  export class ChordBox {
    constructor(selector: string, options?: ChordBoxOptions)
    draw(data: ChordData): void
  }

  export function draw(selector: string, data: ChordData, options?: ChordBoxOptions): void
}