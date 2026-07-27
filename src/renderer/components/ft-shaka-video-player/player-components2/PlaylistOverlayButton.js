import { icon } from '@fortawesome/fontawesome-svg-core'
import { faBars, faPlay } from '@fortawesome/free-solid-svg-icons'

const BARS_ICON = icon(faBars).html[0]
const PLAY_ICON = icon(faPlay).html[0]

export function createPlaylistOverlayButton(onToggle) {
  const button = document.createElement('button')
  button.className = 'playerFullscreenPlaylistButton'
  button.innerHTML = BARS_ICON + PLAY_ICON
  button.dir = 'auto'
  button.addEventListener('click', (event) => {
    // stop this from bubbling up to shaka's own click-to-toggle-play/pause handling
    event.stopPropagation()
    onToggle()
  })
  return button
}
