import shaka from 'shaka-player'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faGear, faCheck } from '@fortawesome/free-solid-svg-icons'

const GEAR_ICON = icon(faGear).html[0]
const CHECK_ICON = icon(faCheck).html[0]

function getQualityLabel(height) {
  if (height >= 2160) return `${height}p (4K)`
  if (height >= 1440) return `${height}p (2K)`
  if (height >= 1080) return `${height}p (HD)`
  return `${height}p`
}

function getQualityBadge(height) {
  if (height >= 2160) return '4K'
  if (height >= 1440) return '2K'
  if (height >= 1080) return 'HD'
  return ''
}

const PIXEL_CHARS = {
  '4': ['0010', '0110', '1210', '1111', '2212', '0020'],
  '2': ['1110', '0001', '0110', '1000', '1111', '2002'],
  'H': ['1001', '1001', '1111', '1221', '1001', '2002'],
  'D': ['1110', '1221', '1001', '1001', '1112', '2220'],
  'K': ['1001', '1001', '1112', '1221', '1001', '2002'],
}

const CHAR_W = 4
const CHAR_H = 6
const CHAR_GAP = 1
const PX_SCALE = 1

function makePixelSvg(text) {
  const totalW = (CHAR_W + CHAR_GAP) * text.length - CHAR_GAP
  const rects = []
  for (let ci = 0; ci < text.length; ci++) {
    const bitmap = PIXEL_CHARS[text[ci]]
    if (!bitmap) continue
    const ox = ci * (CHAR_W + CHAR_GAP)
    for (let row = 0; row < bitmap.length; row++) {
      for (let col = 0; col < bitmap[row].length; col++) {
        if (bitmap[row][col] === '1') {
          rects.push(`<rect x="${ox + col}" y="${row}" width="1" height="1"/>`)
        } else if (bitmap[row][col] === '2') {
          rects.push(`<rect x="${ox + col}" y="${row}" width="1" height="1" fill="rgba(0,0,0,0.4)"/>`)
        }
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${CHAR_H}" width="${totalW * PX_SCALE}" height="${CHAR_H * PX_SCALE}" fill="currentColor" shape-rendering="crispEdges">${rects.join('')}</svg>`
}

export class QualityButton extends shaka.ui.Element {
  constructor(parent, controls) {
    super(parent, controls)

    this.player_ = controls.getPlayer()
    this.isOpen_ = false

    this.wrapper_ = document.createElement('div')
    this.wrapper_.classList.add('ft-quality-wrapper')
    this.parent.appendChild(this.wrapper_)

    this.button_ = document.createElement('button')
    this.button_.classList.add('ft-player-button', 'ft-quality-button')
    this.wrapper_.appendChild(this.button_)

    this.iconSpan_ = document.createElement('span')
    this.iconSpan_.classList.add('ft-quality-icon')
    this.iconSpan_.innerHTML = GEAR_ICON
    this.button_.appendChild(this.iconSpan_)

    this.badge_ = document.createElement('span')
    this.badge_.classList.add('ft-quality-badge')
    this.button_.appendChild(this.badge_)

    // Container wraps the panel and provides padding-bottom as an invisible bridge
    // to the button, blocking seek bar hover events during mouse travel.
    this.dropdownContainer_ = document.createElement('div')
    this.dropdownContainer_.classList.add('ft-quality-dropdown-container')
    this.dropdownContainer_.hidden = true
    this.wrapper_.appendChild(this.dropdownContainer_)

    this.dropdown_ = document.createElement('div')
    this.dropdown_.classList.add('ft-quality-dropdown')
    this.dropdownContainer_.appendChild(this.dropdown_)

    this.eventManager.listen(this.dropdown_, 'click', (e) => {
      const btn = e.target.closest('.ft-quality-option')
      if (!btn) return
      const quality = btn.dataset.quality
      if (quality === 'auto') {
        this.player_.configure({ abr: { enabled: true } })
      } else {
        this.player_.configure({ abr: { enabled: false } })
        const height = parseInt(quality)
        const best = this.player_.getVariantTracks()
          .filter(t => t.height === height)
          .sort((a, b) => b.bandwidth - a.bandwidth)[0]
        if (best) this.player_.selectVariantTrack(best, true)
      }
      this.closeDropdown_()
      this.updateActiveState_()
    })

    this.outsideClickHandler_ = (e) => {
      if (!this.wrapper_.contains(e.target)) this.closeDropdown_()
    }

    this.eventManager.listen(this.button_, 'click', () => {
      this.isOpen_ ? this.closeDropdown_() : this.openDropdown_()
    })

    this.eventManager.listen(this.player_, 'trackschanged', () => this.buildOptions_())
    this.eventManager.listen(this.player_, 'variantchanged', () => this.updateActiveState_())
    this.eventManager.listen(this.player_, 'adaptation', () => this.updateActiveState_())

    this.buildOptions_()
  }

  openDropdown_() {
    this.isOpen_ = true
    this.dropdownContainer_.hidden = false
    document.addEventListener('click', this.outsideClickHandler_)
  }

  closeDropdown_() {
    this.isOpen_ = false
    this.dropdownContainer_.hidden = true
    document.removeEventListener('click', this.outsideClickHandler_)
  }

  buildOptions_() {
    const tracks = this.player_.getVariantTracks()
    const heights = [...new Set(tracks.map(t => t.height).filter(Boolean))].sort((a, b) => b - a)

    this.dropdown_.innerHTML = ''

    const autoBtn = document.createElement('button')
    autoBtn.classList.add('ft-quality-option')
    autoBtn.dataset.quality = 'auto'
    const autoCheck = document.createElement('span')
    autoCheck.classList.add('ft-quality-check')
    autoCheck.innerHTML = CHECK_ICON
    autoBtn.appendChild(autoCheck)
    const autoLabel = document.createElement('span')
    autoLabel.classList.add('ft-quality-label')
    autoLabel.textContent = 'Auto'
    autoBtn.appendChild(autoLabel)
    this.dropdown_.appendChild(autoBtn)

    for (const height of heights) {
      const btn = document.createElement('button')
      btn.classList.add('ft-quality-option')
      btn.dataset.quality = String(height)
      const check = document.createElement('span')
      check.classList.add('ft-quality-check')
      check.innerHTML = CHECK_ICON
      btn.appendChild(check)
      const label = document.createElement('span')
      label.classList.add('ft-quality-label')
      label.textContent = getQualityLabel(height)
      btn.appendChild(label)
      this.dropdown_.appendChild(btn)
    }

    this.updateActiveState_()
  }

  updateActiveState_() {
    const abrEnabled = this.player_.getConfiguration().abr.enabled
    const activeTrack = this.player_.getVariantTracks().find(t => t.active)
    const activeHeight = activeTrack?.height ?? 0

    const badge = abrEnabled ? '' : getQualityBadge(activeHeight)
    this.badge_.innerHTML = badge ? makePixelSvg(badge) : ''
    this.badge_.hidden = !badge

    for (const btn of this.dropdown_.querySelectorAll('.ft-quality-option')) {
      const check = btn.querySelector('.ft-quality-check')
      const isActive = abrEnabled
        ? btn.dataset.quality === 'auto'
        : btn.dataset.quality === String(activeHeight)
      check.style.visibility = isActive ? 'visible' : 'hidden'
    }
  }

  destroy() {
    this.closeDropdown_()
    super.destroy()
  }
}
