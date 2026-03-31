import {
  createDefaultLeafMusicAcordesData,
  isLeafMusicAcordesData,
  type LeafMusicAcordesData,
  type ChordPosition,
} from "@/types/editor-music"

interface LeafMusicAcordesToolConstructor {
  data?: Record<string, unknown>
}

export default class LeafMusicAcordesTool {
  private data: LeafMusicAcordesData

  static get toolbox() {
    return {
      title: "Acordes",
      icon: '<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    }
  }

  constructor({ data }: LeafMusicAcordesToolConstructor) {
    if (data && isLeafMusicAcordesData(data)) {
      this.data = data
    } else {
      this.data = createDefaultLeafMusicAcordesData()
    }
  }

  render(): HTMLElement {
    const wrapper = document.createElement("div")
    wrapper.className = "leaf-music-acordes"

    if (!isLeafMusicAcordesData(this.data)) {
      wrapper.classList.add("leaf-music-acordes--error")
      wrapper.textContent = "Dados do bloco inválidos"
      return wrapper
    }

    const container = document.createElement("div")
    container.className = "leaf-music-acordes__container"

    const editorDiv = document.createElement("div")
    editorDiv.className = "leaf-music-acordes__editor"

    const inputRow = document.createElement("div")
    inputRow.className = "leaf-music-acordes__input-row"

    const inputLabel = document.createElement("label")
    inputLabel.className = "leaf-music-acordes__label"
    inputLabel.textContent = "Digite o acorde (ex: Cm, D7, G):"

    const input = document.createElement("input")
    input.type = "text"
    input.className = "leaf-music-acordes__input"
    input.placeholder = "Ex: Cm, D7, G"
    input.value = ""

    const addBtn = document.createElement("button")
    addBtn.className = "leaf-music-acordes__btn leaf-music-acordes__btn--add"
    addBtn.textContent = "Adicionar"

    inputRow.appendChild(inputLabel)
    inputRow.appendChild(input)
    inputRow.appendChild(addBtn)

    const customBtn = document.createElement("button")
    customBtn.className = "leaf-music-acordes__btn leaf-music-acordes__btn--custom"
    customBtn.textContent = "Personalizar Acorde (Modal)"

    const chordsListDiv = document.createElement("div")
    chordsListDiv.className = "leaf-music-acordes__list"

    const previewDiv = document.createElement("div")
    previewDiv.className = "leaf-music-acordes__preview"

    editorDiv.appendChild(inputRow)
    editorDiv.appendChild(customBtn)
    editorDiv.appendChild(chordsListDiv)

    container.appendChild(editorDiv)
    container.appendChild(previewDiv)
    wrapper.appendChild(container)

    const renderChords = async () => {
      try {
        const { ChordBox } = await import("vexchords")

        previewDiv.innerHTML = ""

        if (this.data.payload.chords.length === 0) {
          const emptyMsg = document.createElement("div")
          emptyMsg.className = "leaf-music-acordes__empty"
          emptyMsg.textContent = "Nenhum acorde adicionado. Use o campo acima para adicionar."
          previewDiv.appendChild(emptyMsg)
          return
        }

        this.data.payload.chords.forEach((chordData, index) => {
          const chordContainer = document.createElement("div")
          chordContainer.className = "leaf-music-acordes__chord-item"

          const nameLabel = document.createElement("div")
          nameLabel.className = "leaf-music-acordes__chord-name"
          nameLabel.textContent = chordData.name

          const chordDiv = document.createElement("div")
          chordDiv.id = `leaf-chord-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

          chordContainer.appendChild(nameLabel)
          chordContainer.appendChild(chordDiv)
          previewDiv.appendChild(chordContainer)

          // Use requestAnimationFrame to ensure the element is in the DOM
          requestAnimationFrame(() => {
            try {
              // ChordBox constructor takes a CSS selector
              const chord = new ChordBox(`#${chordDiv.id}`, {
                width: 100,
                height: 120,
                numStrings: 6,
                numFrets: 5,
                showTuning: true,
                defaultColor: "#666",
              })

              chord.draw({
                chord: chordData.chord,
                barres: chordData.barres || [],
                position: chordData.position || 1,
              })
            } catch (err) {
              console.error(`Erro ao renderizar acorde ${chordData.name}:`, err)
              chordDiv.textContent = "Erro"
            }
          })
        })
      } catch (error) {
        console.error("Erro ao renderizar acordes:", error)
        previewDiv.innerHTML = ""
        const errorMsg = document.createElement("div")
        errorMsg.className = "leaf-music-acordes--error"
        errorMsg.textContent = "Erro ao renderizar acordes."
        previewDiv.appendChild(errorMsg)
      }
    }

    const updateChordsList = () => {
      chordsListDiv.innerHTML = ""
      this.data.payload.chords.forEach((chordData, index) => {
        const chordItem = document.createElement("div")
        chordItem.className = "leaf-music-acordes__item"

        const nameSpan = document.createElement("span")
        nameSpan.textContent = chordData.name

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "×"
        deleteBtn.className = "leaf-music-acordes__delete"
        deleteBtn.onclick = () => {
          this.data.payload.chords.splice(index, 1)
          updateChordsList()
          renderChords()
        }

        chordItem.appendChild(nameSpan)
        chordItem.appendChild(deleteBtn)
        chordsListDiv.appendChild(chordItem)
      })
    }

    const parseChordString = (chordName: string): ChordPosition[] => {
      const chordMap: Record<string, ChordPosition[]> = {
        C: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3], [6, "x"]],
        Cm: [[1, "x"], [2, 3], [3, 3], [4, 1], [5, 2], [6, "x"]],
        C7: [[1, "x"], [2, 1], [3, 0], [4, 2], [5, 3], [6, "x"]],
        D: [[1, 2], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
        Dm: [[1, "x"], [2, 1], [3, 2], [4, 2], [5, "x"], [6, "x"]],
        D7: [[1, 2], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
        E: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]],
        Em: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]],
        E7: [[1, 0], [2, 0], [3, 1], [4, 0], [5, 2], [6, 0]],
        F: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]],
        Fm: [[1, "x"], [2, 1], [3, 1], [4, 1], [5, 3], [6, 1]],
        F7: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 1]],
        G: [[1, 3], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
        Gm: [[1, 3], [2, 5], [3, 3], [4, 3], [5, 3], [6, 3]],
        G7: [[1, 3], [2, 0], [3, 0], [4, 0], [5, 1], [6, 3]],
        A: [[1, 0], [2, 2], [3, 2], [4, 1], [5, 0], [6, "x"]],
        Am: [[1, 0], [2, 0], [3, 2], [4, 2], [5, 0], [6, "x"]],
        A7: [[1, 0], [2, 2], [3, 0], [4, 1], [5, 0], [6, "x"]],
        B: [[1, "x"], [2, 4], [3, 4], [4, 3], [5, 2], [6, "x"]],
        Bm: [[1, "x"], [2, 2], [3, 4], [4, 4], [5, 2], [6, "x"]],
        B7: [[1, "x"], [2, 4], [3, 2], [4, 1], [5, 2], [6, "x"]],
      }

      const normalized = chordName.trim()
      return chordMap[normalized] || [[1, "x"], [2, "x"], [3, "x"], [4, "x"], [5, "x"], [6, "x"]]
    }

    addBtn.addEventListener("click", () => {
      const chordName = input.value.trim()
      if (!chordName) return

      const chordPositions = parseChordString(chordName)

      this.data.payload.chords.push({
        name: chordName,
        chord: chordPositions,
        barres: [],
        position: 1,
      })

      input.value = ""
      updateChordsList()
      renderChords()
    })

    const openCustomModal = () => {
      const modal = document.createElement("div")
      modal.className = "leaf-music-acordes__modal"

      const modalContent = document.createElement("div")
      modalContent.className = "leaf-music-acordes__modal-content"

      const modalTitle = document.createElement("h3")
      modalTitle.className = "leaf-music-acordes__modal-title"
      modalTitle.textContent = "Personalizar Acorde"

      const nameInputRow = document.createElement("div")
      nameInputRow.className = "leaf-music-acordes__modal-field"

      const nameLabel = document.createElement("label")
      nameLabel.textContent = "Nome do Acorde:"
      nameLabel.className = "leaf-music-acordes__modal-label"

      const nameInput = document.createElement("input")
      nameInput.type = "text"
      nameInput.placeholder = "Ex: Cm"
      nameInput.className = "leaf-music-acordes__modal-input"

      nameInputRow.appendChild(nameLabel)
      nameInputRow.appendChild(nameInput)

      const stringsLabel = document.createElement("div")
      stringsLabel.className = "leaf-music-acordes__modal-label"
      stringsLabel.textContent = "Posição de cada corda (0 = aberto, x = muted, número = casa):"

      const stringsContainer = document.createElement("div")
      stringsContainer.className = "leaf-music-acordes__modal-strings"

      const stringInputs: HTMLInputElement[] = []

      for (let i = 0; i < 6; i++) {
        const stringWrapper = document.createElement("div")
        stringWrapper.className = "leaf-music-acordes__modal-string-wrapper"

        const stringLabel = document.createElement("div")
        stringLabel.className = "leaf-music-acordes__modal-string-label"
        stringLabel.textContent = `Corda ${i + 1}`

        const stringInput = document.createElement("input")
        stringInput.type = "text"
        stringInput.placeholder = "0"
        stringInput.className = "leaf-music-acordes__modal-string-input"
        stringInput.value = "0"

        stringWrapper.appendChild(stringLabel)
        stringWrapper.appendChild(stringInput)
        stringsContainer.appendChild(stringWrapper)
        stringInputs.push(stringInput)
      }

      const positionRow = document.createElement("div")
      positionRow.className = "leaf-music-acordes__modal-field"

      const positionLabel = document.createElement("label")
      positionLabel.textContent = "Casa inicial:"
      positionLabel.className = "leaf-music-acordes__modal-label"

      const positionInput = document.createElement("input")
      positionInput.type = "number"
      positionInput.min = "1"
      positionInput.max = "12"
      positionInput.value = "1"
      positionInput.className = "leaf-music-acordes__modal-position-input"

      positionRow.appendChild(positionLabel)
      positionRow.appendChild(positionInput)

      const buttonsRow = document.createElement("div")
      buttonsRow.className = "leaf-music-acordes__modal-buttons"

      const saveBtn = document.createElement("button")
      saveBtn.textContent = "Salvar"
      saveBtn.className = "leaf-music-acordes__btn leaf-music-acordes__btn--save"

      const cancelBtn = document.createElement("button")
      cancelBtn.textContent = "Cancelar"
      cancelBtn.className = "leaf-music-acordes__btn leaf-music-acordes__btn--cancel"

      buttonsRow.appendChild(saveBtn)
      buttonsRow.appendChild(cancelBtn)

      modalContent.appendChild(modalTitle)
      modalContent.appendChild(nameInputRow)
      modalContent.appendChild(stringsLabel)
      modalContent.appendChild(stringsContainer)
      modalContent.appendChild(positionRow)
      modalContent.appendChild(buttonsRow)
      modal.appendChild(modalContent)
      document.body.appendChild(modal)

      saveBtn.addEventListener("click", () => {
        const chordName = nameInput.value.trim() || "Custom"
        const chordPositions: ChordPosition[] = stringInputs.map((inp, idx) => {
          const value = inp.value.trim().toLowerCase()
          let fretValue: number | string = 0
          if (value === "x") {
            fretValue = "x"
          } else {
            fretValue = parseInt(value, 10) || 0
          }
          return [idx + 1, fretValue] as ChordPosition
        })

        const position = parseInt(positionInput.value, 10) || 1

        this.data.payload.chords.push({
          name: chordName,
          chord: chordPositions,
          barres: [],
          position: position,
        })

        document.body.removeChild(modal)
        updateChordsList()
        renderChords()
      })

      cancelBtn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
        }
      })
    }

    customBtn.addEventListener("click", openCustomModal)

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addBtn.click()
      }
    })

    updateChordsList()

    // Wait for DOM insertion before rendering chords
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        renderChords()
      })
    })

    return wrapper
  }

  save(): LeafMusicAcordesData {
    return {
      schemaVersion: this.data.schemaVersion,
      variant: "acordes",
      payload: { ...this.data.payload },
    }
  }
}