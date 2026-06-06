import shaka from 'shaka-player'
import { formatDurationAsTimestamp } from '../../../helpers/utils'

export class TimeDisplay extends shaka.ui.Element {
  constructor(parent, controls) {
    super(parent, controls)

    const video = controls.getVideo()

    this.container_ = document.createElement('div')
    this.container_.classList.add('ft-player-button', 'ft-time-display')
    this.parent.appendChild(this.container_)

    this.currentTimeSpan_ = document.createElement('span')
    this.durationSpan_ = document.createElement('span')
    this.container_.appendChild(this.currentTimeSpan_)
    this.container_.appendChild(this.durationSpan_)

    const updateTime = () => {
      this.currentTimeSpan_.textContent = formatDurationAsTimestamp(Math.floor(video.currentTime) || 0)
    }

    const updateDuration = () => {
      const dur = video.duration
      this.durationSpan_.textContent = isFinite(dur) ? ' / ' + formatDurationAsTimestamp(Math.floor(dur)) : ''
    }

    updateTime()
    updateDuration()

    this.eventManager.listen(video, 'timeupdate', updateTime)
    this.eventManager.listen(video, 'durationchange', updateDuration)
  }
}
