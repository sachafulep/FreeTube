<template>
  <div
    v-show="visible"
    class="fullscreenOverlay"
  >
    <WatchFullscreenOverlayHeader
      :title="title"
      @close="$emit('close')"
    />
    <slot />
  </div>
</template>

<script setup>
import WatchFullscreenOverlayHeader from '../WatchFullscreenOverlayHeader/WatchFullscreenOverlayHeader.vue'

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped src="./WatchFullscreenOverlay.css" />
