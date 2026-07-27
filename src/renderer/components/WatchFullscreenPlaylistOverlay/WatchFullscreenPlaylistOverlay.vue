<template>
  <div
    ref="listElement"
    class="playlistOverlayList"
  >
    <FtListVideoNumbered
      v-for="(item, index) in playlistItems"
      :key="item.playlistItemId || item.videoId"
      class="playlistOverlayItem"
      :class="{ playlistOverlayItemActive: currentPlaylistVideoIndex === index }"
      :data="item"
      :playlist-id="playlistId"
      :playlist-type="playlistType"
      :playlist-index="playlistReverse ? playlistItems.length - index - 1 : index"
      :playlist-item-id="item.playlistItemId"
      :video-index="index"
      :is-current-video="currentPlaylistVideoIndex === index"
      appearance="watchPlaylistItem"
      :initial-visible-state="index <= currentPlaylistVideoIndex + 4"
    />
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

import FtListVideoNumbered from '../FtListVideoNumbered/FtListVideoNumbered.vue'

const props = defineProps({
  playlistItems: {
    type: Array,
    required: true
  },
  playlistId: {
    type: String,
    default: null
  },
  playlistType: {
    type: String,
    default: null
  },
  currentPlaylistVideoIndex: {
    type: Number,
    required: true
  },
  playlistReverse: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    required: true
  },
})

const listElement = ref(null)

watch(() => props.isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      // wait an extra frame so newly-eager items (just switched from their placeholder height)
      // have a settled layout before we measure where to scroll to
      requestAnimationFrame(() => {
        const currentItem = listElement.value?.children[props.currentPlaylistVideoIndex]
        currentItem?.scrollIntoView({ block: 'start' })
      })
    })
  }
})
</script>

<style scoped src="./WatchFullscreenPlaylistOverlay.css" />
