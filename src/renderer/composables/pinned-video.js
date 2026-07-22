import { computed } from 'vue'

import store from '../store'

/**
 * @param {import('vue').Ref<string>} videoId
 */
export function usePinnedVideo(videoId) {
  const isPinned = computed(() => store.getters.getHistoryCacheById[videoId.value]?.isPinned === true)

  function togglePinned() {
    const newIsPinned = !isPinned.value
    store.dispatch('updatePinStatus', { videoId: videoId.value, isPinned: newIsPinned })
  }

  return { isPinned, togglePinned }
}
