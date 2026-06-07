import shaka from 'shaka-player'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons'

const EXPAND_ICON = icon(faUpRightAndDownLeftFromCenter).html[0]
const COMPRESS_ICON = icon(faDownLeftAndUpRightToCenter).html[0]

export class FullscreenButton extends shaka.ui.Element {
  constructor(parent, controls) {
    super(parent, controls)

    this.button_ = document.createElement('button')
    this.button_.classList.add('ft-player-button', 'ft-fullscreen-button')
    this.parent.appendChild(this.button_)

    const updateIcon = () => {
      this.button_.innerHTML = document.fullscreenElement ? COMPRESS_ICON : EXPAND_ICON
    }

    updateIcon()

    this.eventManager.listen(this.button_, 'click', () => {
      controls.toggleFullScreen()
    })

    this.eventManager.listen(document, 'fullscreenchange', updateIcon)
  }
}
