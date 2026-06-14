import shaka from 'shaka-player'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faVolumeXmark, faVolumeLow, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

function getVolumeIcon(video) {
  if (video.muted || video.volume === 0) return icon(faVolumeXmark).html[0]
  if (video.volume <= 0.5) return icon(faVolumeLow).html[0]
  return icon(faVolumeHigh).html[0]
}

export class VolumeControl extends shaka.ui.Element {
  constructor(parent, controls) {
    super(parent, controls)

    const video = controls.getVideo()

    this.container_ = document.createElement('div')
    this.container_.classList.add('ft-volume-control')
    this.parent.appendChild(this.container_)

    this.button_ = document.createElement('button')
    this.button_.classList.add('ft-player-button', 'ft-volume-button')
    this.container_.appendChild(this.button_)

    this.sliderContainer_ = document.createElement('div')
    this.sliderContainer_.classList.add('ft-volume-slider-container')
    this.container_.appendChild(this.sliderContainer_)

    this.slider_ = document.createElement('input')
    this.slider_.type = 'range'
    this.slider_.min = '0'
    this.slider_.max = '1'
    this.slider_.step = '0.02'
    this.slider_.classList.add('ft-volume-slider')
    this.sliderContainer_.appendChild(this.slider_)

    const updateUI = () => {
      this.button_.innerHTML = getVolumeIcon(video)
      const vol = video.muted ? 0 : video.volume
      this.slider_.value = String(vol)
      this.slider_.style.setProperty('--volume-pct', `${vol * 100}%`)
    }

    updateUI()

    this.eventManager.listen(video, 'volumechange', updateUI)

    this.eventManager.listen(this.button_, 'click', () => {
      video.muted = !video.muted
    })

    this.eventManager.listen(this.slider_, 'input', () => {
      video.volume = parseFloat(this.slider_.value)
      video.muted = this.slider_.value === '0'
    })

    this.eventManager.listen(this.sliderContainer_, 'click', (e) => {
      if (e.target === this.slider_) return
      const rect = this.slider_.getBoundingClientRect()
      const vol = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      video.volume = vol
      video.muted = vol === 0
    })
  }
}
