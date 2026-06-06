import shaka from 'shaka-player'

export class ChapterNameButton extends shaka.ui.Element {
  constructor(events, parent, controls, initialTitle = '') {
    super(parent, controls)

    this.button_ = document.createElement('button')
    this.button_.classList.add('ft-chapter-name-button')

    this.nameSpan_ = document.createElement('span')
    this.nameSpan_.textContent = initialTitle
    this.button_.appendChild(this.nameSpan_)
    this.parent.appendChild(this.button_)

    this.eventManager.listen(this.button_, 'click', () => {
      events.dispatchEvent(new CustomEvent('toggleSidebarChapters'))
    })

    this.eventManager.listen(events, 'chapterChanged', (event) => {
      this.nameSpan_.textContent = event.detail.title
    })
  }
}
