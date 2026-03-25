import {
  createDefaultLeafMusicSpikeData,
  isLeafMusicSpikeData,
  type LeafMusicSpikeData,
} from "@/types/editor-music"

interface LeafMusicSpikeToolConstructor {
  data?: Record<string, unknown>
}

/**
 * Bloco de spike: prova VexFlow + round-trip JSON (Fase 1 / DATA-01).
 * Carrega `vexflow` apenas no cliente via import dinâmico em `renderNotation`.
 */
export default class LeafMusicSpikeTool {
  private data: LeafMusicSpikeData

  static get toolbox() {
    return {
      title: "Spike musical (teste)",
      icon: '<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    }
  }

  constructor({ data }: LeafMusicSpikeToolConstructor) {
    if (data && isLeafMusicSpikeData(data)) {
      this.data = data
    } else {
      this.data = createDefaultLeafMusicSpikeData()
    }
  }

  render(): HTMLElement {
    const wrapper = document.createElement("div")
    wrapper.className = "leaf-music-spike"

    if (!isLeafMusicSpikeData(this.data)) {
      wrapper.classList.add("leaf-music-spike--error")
      wrapper.textContent = "Dados do bloco inválidos"
      return wrapper
    }

    const host = document.createElement("div")
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `leaf-music-spike-${crypto.randomUUID()}`
        : `leaf-music-spike-${Date.now()}-${Math.random().toString(36).slice(2)}`
    host.id = id
    host.className = "leaf-music-spike__vex-host"
    wrapper.appendChild(host)

    void this.renderNotation(id).catch(() => {
      host.textContent = "Não foi possível carregar a notação."
    })

    return wrapper
  }

  private async renderNotation(elementId: string): Promise<void> {
    const { Factory } = await import("vexflow")
    const factory = Factory.newFromElementId(elementId, 400, 160)
    const score = factory.EasyScore()
    score.set({ clef: "treble", time: "4/4" })
    const system = factory.System({ width: 400, spaceBetweenStaves: 10 })
    const stave = system.addStave({
      voices: [score.voice(score.notes("C5/q"))],
    })
    stave.addClef("treble").addTimeSignature("4/4")
    factory.draw()
  }

  save(): LeafMusicSpikeData {
    return {
      schemaVersion: this.data.schemaVersion,
      variant: "spike",
      payload: { ...this.data.payload },
    }
  }
}
