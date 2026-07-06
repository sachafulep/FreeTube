export function setupSeekBarTooltip(containerEl, videoEl, getChapters) {
  const thumbnailTimeContainer = containerEl.querySelector('.shaka-player-ui-thumbnail-time-container')
  const seekBarEl = containerEl.querySelector('.shaka-range-element')
  if (!thumbnailTimeContainer || !seekBarEl) return null

  const tooltipEl = document.createElement('div')
  tooltipEl.classList.add('ft-seek-tooltip')

  const timeEl = document.createElement('span')
  timeEl.classList.add('ft-seek-tooltip-time')

  tooltipEl.appendChild(timeEl)

  const hasChapters = getChapters().length > 0

  let chapterEl = null

  if (hasChapters) {
    chapterEl = document.createElement('span')
    chapterEl.classList.add('ft-seek-tooltip-chapter')
    tooltipEl.appendChild(chapterEl)
  }

  thumbnailTimeContainer.insertAdjacentElement('afterbegin', tooltipEl)

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const onMouseMove = (e) => {
    const rect = seekBarEl.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const time = pct * videoEl.duration

    timeEl.textContent = isFinite(time) ? formatTime(time) : ''

    if (chapterEl) {
      const chapters = getChapters()
      const chapter = [...chapters].reverse().find(ch => ch.startSeconds <= time)
      chapterEl.textContent = chapter?.title ?? ''
    }
  }

  const onMouseLeave = () => {
    timeEl.textContent = ''

    if (chapterEl) {
      chapterEl.textContent = ''
    }
  }

  seekBarEl.addEventListener('mousemove', onMouseMove)
  seekBarEl.addEventListener('mouseleave', onMouseLeave)

  return () => {
    seekBarEl.removeEventListener('mousemove', onMouseMove)
    seekBarEl.removeEventListener('mouseleave', onMouseLeave)
    tooltipEl.remove()
  }
}
