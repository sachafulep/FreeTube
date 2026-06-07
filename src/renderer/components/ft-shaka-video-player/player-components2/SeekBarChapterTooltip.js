export function setupSeekBarChapterTooltip(containerEl, videoEl, getChapters) {
  const thumbnailTimeContainer = containerEl.querySelector('.shaka-player-ui-thumbnail-time-container')
  const seekBarEl = containerEl.querySelector('.shaka-range-element')
  if (!thumbnailTimeContainer || !seekBarEl) return null

  const chapterNameEl = document.createElement('span')
  chapterNameEl.classList.add('ft-seek-chapter-name')
  thumbnailTimeContainer.insertAdjacentElement('afterbegin', chapterNameEl)

  const onMouseMove = (e) => {
    const chapters = getChapters()
    if (chapters.length === 0) {
      chapterNameEl.textContent = ''
      return
    }
    const rect = seekBarEl.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const time = pct * videoEl.duration
    const chapter = [...chapters].reverse().find(ch => ch.startSeconds <= time)
    chapterNameEl.textContent = chapter?.title ?? ''
  }

  const onMouseLeave = () => { chapterNameEl.textContent = '' }

  seekBarEl.addEventListener('mousemove', onMouseMove)
  seekBarEl.addEventListener('mouseleave', onMouseLeave)

  return () => {
    seekBarEl.removeEventListener('mousemove', onMouseMove)
    seekBarEl.removeEventListener('mouseleave', onMouseLeave)
    chapterNameEl.remove()
  }
}
