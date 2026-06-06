import shaka from 'shaka-player'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

const PLAY_ICON = icon(faPlay).html[0]
const PAUSE_ICON = icon(faPause).html[0]

export class PlayPauseButton extends shaka.ui.Element {
  constructor(parent, controls) {
    super(parent, controls)

    const video = controls.getVideo()

    this.button_ = document.createElement('button')
    this.button_.classList.add('ft-player-button', 'ft-play-pause-button')
    this.parent.appendChild(this.button_)

    const updateIcon = () => {
      this.button_.innerHTML = (video.paused || video.ended) ? PLAY_ICON : PAUSE_ICON
    }

    updateIcon()

    this.eventManager.listen(this.button_, 'click', () => {
      if (video.paused || video.ended) {
        video.play()
      } else {
        video.pause()
      }
    })

    this.eventManager.listen(video, 'play', updateIcon)
    this.eventManager.listen(video, 'pause', updateIcon)
    this.eventManager.listen(video, 'ended', updateIcon)
  }
}
