import {
  createDefaultLeafMusicPartituraData,
  isLeafMusicPartituraData,
  type LeafMusicPartituraData,
} from "@/types/editor-music"

interface LeafMusicPartituraToolConstructor {
  data?: Record<string, unknown>
}

/**
 * Parseia a string EasyScore simplificada ("C4/q D4/q E4/q F4/q")
 * e retorna array de { keys: string[], duration: string }.
 */
function parseNotesString(input: string): Array<{ keys: string[]; duration: string }> {
  const tokens = input.trim().split(/\s+/)
  const result: Array<{ keys: string[]; duration: string }> = []

  const durationMap: Record<string, string> = {
    w: "w",
    h: "h",
    q: "q",
    "8": "8",
    "16": "16",
    "32": "32",
  }

  let lastDuration = "q"

  for (const token of tokens) {
    const parts = token.split("/")
    const noteStr = parts[0]
    const durStr = parts[1] || lastDuration

    const duration = durationMap[durStr] || "q"
    lastDuration = duration

    // Convert "C4" -> "c/4", "C#4" -> "c#/4", "Bb3" -> "bb/3"
    const match = noteStr.match(/^([A-Ga-g][#b]?)(\d)$/)
    if (match) {
      const noteName = match[1].toLowerCase()
      const octave = match[2]
      result.push({ keys: [`${noteName}/${octave}`], duration })
    }
  }

  return result
}

export default class LeafMusicPartituraTool {
  private data: LeafMusicPartituraData

  static get toolbox() {
    return {
      title: "Partitura",
      icon: '<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    }
  }

  constructor({ data }: LeafMusicPartituraToolConstructor) {
    if (data && isLeafMusicPartituraData(data)) {
      this.data = data
    } else {
      this.data = createDefaultLeafMusicPartituraData()
    }
  }

  render(): HTMLElement {
    const wrapper = document.createElement("div")
    wrapper.className = "leaf-music-partitura"

    if (!isLeafMusicPartituraData(this.data)) {
      wrapper.classList.add("leaf-music-partitura--error")
      wrapper.textContent = "Dados do bloco inválidos"
      return wrapper
    }

    const container = document.createElement("div")
    container.className = "leaf-music-partitura__container"

    const editorDiv = document.createElement("div")
    editorDiv.className = "leaf-music-partitura__editor"

    const inputLabel = document.createElement("label")
    inputLabel.className = "leaf-music-partitura__label"
    inputLabel.textContent = "Digite as notas (formato VexFlow/EasyScore):"

    const input = document.createElement("input")
    input.type = "text"
    input.className = "leaf-music-partitura__input"
    input.value = this.data.payload.notes
    input.placeholder = "Ex: C4/q D4/q E4/q F4/q"

    const configRow = document.createElement("div")
    configRow.className = "leaf-music-partitura__config"

    const clefLabel = document.createElement("label")
    clefLabel.textContent = "Clave:"
    const clefSelect = document.createElement("select")
    clefSelect.className = "leaf-music-partitura__select"
    const trebleOpt = document.createElement("option")
    trebleOpt.value = "treble"
    trebleOpt.textContent = "Sol (Treble)"
    const bassOpt = document.createElement("option")
    bassOpt.value = "bass"
    bassOpt.textContent = "Fá (Bass)"
    clefSelect.appendChild(trebleOpt)
    clefSelect.appendChild(bassOpt)
    clefSelect.value = this.data.payload.clef

    const timeLabel = document.createElement("label")
    timeLabel.textContent = "Compasso:"
    const timeSelect = document.createElement("select")
    timeSelect.className = "leaf-music-partitura__select"
    const time44 = document.createElement("option")
    time44.value = "4/4"
    time44.textContent = "4/4"
    const time34 = document.createElement("option")
    time34.value = "3/4"
    time34.textContent = "3/4"
    const time68 = document.createElement("option")
    time68.value = "6/8"
    time68.textContent = "6/8"
    timeSelect.appendChild(time44)
    timeSelect.appendChild(time34)
    timeSelect.appendChild(time68)
    timeSelect.value = this.data.payload.timeSignature

    const renderBtn = document.createElement("button")
    renderBtn.className = "leaf-music-partitura__btn"
    renderBtn.textContent = "Renderizar Partitura"

    configRow.appendChild(clefLabel)
    configRow.appendChild(clefSelect)
    configRow.appendChild(timeLabel)
    configRow.appendChild(timeSelect)

    const previewDiv = document.createElement("div")
    previewDiv.className = "leaf-music-partitura__preview"

    editorDiv.appendChild(inputLabel)
    editorDiv.appendChild(input)
    editorDiv.appendChild(configRow)
    editorDiv.appendChild(renderBtn)

    container.appendChild(editorDiv)
    container.appendChild(previewDiv)
    wrapper.appendChild(container)

    const renderPreview = async () => {
      try {
        const VexFlow = await import("vexflow")
        const { Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow

        const notesValue = input.value || "C4/q D4/q E4/q F4/q"
        const clefValue = clefSelect.value
        const timeValue = timeSelect.value

        previewDiv.innerHTML = ""

        const svgContainer = document.createElement("div")
        previewDiv.appendChild(svgContainer)

        // Use low-level API with direct DOM element reference (no getElementById)
        const renderer = new Renderer(svgContainer, Renderer.Backends.SVG)
        renderer.resize(500, 200)
        const context = renderer.getContext()
        context.setFont("Arial", 10)

        const stave = new Stave(10, 40, 480)
        stave.addClef(clefValue)
        stave.addTimeSignature(timeValue)
        stave.setContext(context).draw()

        const parsedNotes = parseNotesString(notesValue)

        if (parsedNotes.length > 0) {
          const staveNotes = parsedNotes.map(
            (n) => new StaveNote({ clef: clefValue, keys: n.keys, duration: n.duration })
          )

          // Parse time signature
          const [beats, beatValue] = timeValue.split("/").map(Number)
          const voice = new Voice({ numBeats: beats, beatValue: beatValue })
          voice.setStrict(false)
          voice.addTickables(staveNotes)

          new Formatter().joinVoices([voice]).format([voice], 440)
          voice.draw(context, stave)
        }

        this.data = {
          schemaVersion: this.data.schemaVersion,
          variant: "partitura",
          payload: {
            notes: notesValue,
            clef: clefValue,
            timeSignature: timeValue,
            width: 500,
            height: 200,
          },
        }
      } catch (error) {
        console.error("Erro ao renderizar partitura:", error)
        previewDiv.innerHTML = ""
        const errorMsg = document.createElement("div")
        errorMsg.className = "leaf-music-partitura--error"
        errorMsg.textContent = "Erro ao renderizar partitura. Verifique o formato das notas."
        previewDiv.appendChild(errorMsg)
      }
    }

    renderBtn.addEventListener("click", renderPreview)

    // Wait for the element to be in the DOM before rendering
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        renderPreview()
      })
    })

    return wrapper
  }

  save(): LeafMusicPartituraData {
    return {
      schemaVersion: this.data.schemaVersion,
      variant: "partitura",
      payload: { ...this.data.payload },
    }
  }
}