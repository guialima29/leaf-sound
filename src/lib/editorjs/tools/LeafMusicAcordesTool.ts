import type { BlockAPI, BlockToolConstructorOptions } from "@editorjs/editorjs"
import {
  createDefaultLeafMusicAcordesData,
  isLeafMusicAcordesData,
  type LeafMusicAcordesData,
  type ChordPosition,
} from "@/types/editor-music"
import { findGuitarChord, normalizeChordName } from "@/lib/editorjs/chords/guitar-chords"

const STRING_COUNT = 6
const MAX_FRET = 24
const MAX_START_FRET = 12

// Ordem em que o modal mostra as cordas: da 6 (Mi grave) para a 1 (Mi agudo)
const STRING_LABELS: Record<number, string> = {
  6: "6 (Mi grave)",
  5: "5 (Lá)",
  4: "4 (Ré)",
  3: "3 (Sol)",
  2: "2 (Si)",
  1: "1 (Mi agudo)",
}

export default class LeafMusicAcordesTool {
  private data: LeafMusicAcordesData
  private block?: BlockAPI
  // Fecha o modal "Personalizar" aberto (se houver), removendo seus listeners
  private closeModal: (() => void) | null = null

  static get toolbox() {
    return {
      title: "Acordes",
      icon: '<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    }
  }

  constructor({ data, block }: Partial<BlockToolConstructorOptions<Record<string, unknown>>>) {
    this.block = block
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

    // Aviso de acorde não reconhecido, logo abaixo do input
    const messageDiv = document.createElement("div")
    messageDiv.className = "leaf-music-acordes__message"
    messageDiv.setAttribute("role", "alert")
    messageDiv.hidden = true

    const clearMessage = () => {
      messageDiv.hidden = true
      messageDiv.textContent = ""
    }

    const customBtn = document.createElement("button")
    customBtn.className = "leaf-music-acordes__btn leaf-music-acordes__btn--custom"
    customBtn.textContent = "Personalizar Acorde (Modal)"

    const chordsListDiv = document.createElement("div")
    chordsListDiv.className = "leaf-music-acordes__list"

    const previewDiv = document.createElement("div")
    previewDiv.className = "leaf-music-acordes__preview"

    editorDiv.appendChild(inputRow)
    editorDiv.appendChild(messageDiv)
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
          this.block?.dispatchChange()
        }

        chordItem.appendChild(nameSpan)
        chordItem.appendChild(deleteBtn)
        chordsListDiv.appendChild(chordItem)
      })
    }

    const openCustomModal = (presetName = "") => {
      // Só um modal por vez
      this.closeModal?.()

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
      nameInput.value = presetName

      nameInputRow.appendChild(nameLabel)
      nameInputRow.appendChild(nameInput)

      const stringsLabel = document.createElement("div")
      stringsLabel.className = "leaf-music-acordes__modal-label"
      stringsLabel.textContent = `Casa de cada corda (x = abafada, 0 = solta, 1 a ${MAX_FRET} = casa):`

      const stringsContainer = document.createElement("div")
      stringsContainer.className = "leaf-music-acordes__modal-strings"

      // De cima para baixo: corda 6 (Mi grave) até corda 1 (Mi agudo).
      // O número da corda segue a convenção do VexChords (1 = Mi agudo).
      const stringInputs: Array<{ stringNumber: number; input: HTMLInputElement }> = []

      for (let stringNumber = STRING_COUNT; stringNumber >= 1; stringNumber--) {
        const stringWrapper = document.createElement("div")
        stringWrapper.className = "leaf-music-acordes__modal-string-wrapper"

        const stringLabel = document.createElement("div")
        stringLabel.className = "leaf-music-acordes__modal-string-label"
        stringLabel.textContent = `Corda ${STRING_LABELS[stringNumber]}`

        const stringInput = document.createElement("input")
        stringInput.type = "text"
        stringInput.placeholder = "0"
        stringInput.className = "leaf-music-acordes__modal-string-input"
        stringInput.value = "0"
        stringInput.setAttribute("aria-label", `Corda ${STRING_LABELS[stringNumber]}`)

        stringWrapper.appendChild(stringLabel)
        stringWrapper.appendChild(stringInput)
        stringsContainer.appendChild(stringWrapper)
        stringInputs.push({ stringNumber, input: stringInput })
      }

      const positionRow = document.createElement("div")
      positionRow.className = "leaf-music-acordes__modal-field"

      const positionLabel = document.createElement("label")
      positionLabel.textContent = "Casa inicial:"
      positionLabel.className = "leaf-music-acordes__modal-label"

      const positionInput = document.createElement("input")
      positionInput.type = "number"
      positionInput.min = "1"
      positionInput.max = String(MAX_START_FRET)
      positionInput.value = "1"
      positionInput.className = "leaf-music-acordes__modal-position-input"

      positionRow.appendChild(positionLabel)
      positionRow.appendChild(positionInput)

      const errorDiv = document.createElement("div")
      errorDiv.className = "leaf-music-acordes__modal-error"
      errorDiv.setAttribute("role", "alert")
      errorDiv.hidden = true

      const showError = (message: string, field?: HTMLInputElement) => {
        errorDiv.textContent = message
        errorDiv.hidden = false
        field?.focus()
      }

      const clearError = () => {
        errorDiv.hidden = true
        errorDiv.textContent = ""
      }

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
      modalContent.appendChild(errorDiv)
      modalContent.appendChild(buttonsRow)
      modal.appendChild(modalContent)
      document.body.appendChild(modal)

      // O modal fica em document.body, fora do wrapper do Editor.js, e o Editor.js
      // escuta keydown em captura no document (repassa Tab, Delete etc. ao bloco
      // atual). Um stopPropagation no input chegaria tarde demais, então o
      // isolamento é feito em captura na window, que roda antes: enquanto o modal
      // está aberto nenhuma tecla chega ao Editor.js. Sem preventDefault, a
      // digitação nos campos continua normal. Esc fecha e Enter (em um campo,
      // fora de composição IME) salva.
      const onKeydown = (e: KeyboardEvent) => {
        e.stopPropagation()
        if (e.isComposing) return
        if (e.key === "Escape") {
          e.preventDefault()
          close()
        } else if (
          e.key === "Enter" &&
          e.target instanceof HTMLInputElement &&
          modal.contains(e.target)
        ) {
          e.preventDefault()
          save()
        }
      }

      let closed = false
      const close = () => {
        if (closed) return
        closed = true
        window.removeEventListener("keydown", onKeydown, true)
        modal.remove()
        if (this.closeModal === close) this.closeModal = null
      }

      const save = () => {
        clearError()

        const chordPositions: ChordPosition[] = []
        for (const { stringNumber, input: stringInput } of stringInputs) {
          const value = stringInput.value.trim().toLowerCase()
          if (value === "x") {
            chordPositions.push([stringNumber, "x"])
            continue
          }
          const fret = /^\d+$/.test(value) ? parseInt(value, 10) : NaN
          if (!(fret >= 0 && fret <= MAX_FRET)) {
            showError(
              `Corda ${STRING_LABELS[stringNumber]}: use "x" ou um número inteiro de 0 a ${MAX_FRET}.`,
              stringInput,
            )
            return
          }
          chordPositions.push([stringNumber, fret])
        }

        const positionValue = positionInput.value.trim()
        const position = /^\d+$/.test(positionValue) ? parseInt(positionValue, 10) : NaN
        if (!(position >= 1 && position <= MAX_START_FRET)) {
          showError(`Casa inicial: use um número inteiro de 1 a ${MAX_START_FRET}.`, positionInput)
          return
        }

        // Salva na convenção do VexChords: corda 1 (Mi agudo) primeiro
        chordPositions.sort((a, b) => a[0] - b[0])

        this.data.payload.chords.push({
          name: nameInput.value.trim() || "Custom",
          chord: chordPositions,
          barres: [],
          position,
        })

        close()
        clearMessage()
        updateChordsList()
        renderChords()
        this.block?.dispatchChange()
      }

      this.closeModal = close
      window.addEventListener("keydown", onKeydown, true)

      saveBtn.addEventListener("click", save)
      cancelBtn.addEventListener("click", close)
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close()
      })
      modal.addEventListener("input", clearError)

      if (presetName) {
        stringInputs[0].input.focus()
        stringInputs[0].input.select()
      } else {
        nameInput.focus()
      }
    }

    const showUnknownMessage = (chordName: string) => {
      messageDiv.textContent = `Acorde "${chordName}" não reconhecido. Use `
      const link = document.createElement("button")
      link.type = "button"
      link.className = "leaf-music-acordes__message-link"
      link.textContent = "Personalizar"
      link.addEventListener("click", () => openCustomModal(chordName))
      messageDiv.appendChild(link)
      messageDiv.appendChild(document.createTextNode(" para desenhá-lo."))
      messageDiv.hidden = false
    }

    addBtn.addEventListener("click", () => {
      const typedName = input.value.trim()
      if (!typedName) return

      const found = findGuitarChord(typedName)
      if (!found) {
        // Não adiciona nada: desenhar um acorde inventado enganaria o usuário
        showUnknownMessage(normalizeChordName(typedName))
        return
      }

      this.data.payload.chords.push({
        name: found.name,
        chord: found.chord,
        barres: found.barres,
        position: found.position,
      })

      input.value = ""
      clearMessage()
      updateChordsList()
      renderChords()
      this.block?.dispatchChange()
    })

    input.addEventListener("input", clearMessage)

    customBtn.addEventListener("click", () => openCustomModal())

    // keydown (e não keypress) para o Editor.js não criar/apagar blocos com
    // Enter, Backspace, Delete ou Tab dentro do campo
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // Enter que confirma composição de IME não deve adicionar o acorde
        if (e.isComposing) return
        e.preventDefault()
        e.stopPropagation()
        addBtn.click()
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "Tab") {
        e.stopPropagation()
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

  destroy(): void {
    this.closeModal?.()
    this.closeModal = null
  }

  save(): LeafMusicAcordesData {
    return {
      schemaVersion: this.data.schemaVersion,
      variant: "acordes",
      payload: { ...this.data.payload },
    }
  }
}