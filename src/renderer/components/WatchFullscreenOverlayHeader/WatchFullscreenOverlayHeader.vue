<template>
  <div class="fullscreenOverlayHeader">
    <bdi class="fullscreenOverlayHeaderTitle">{{ title }}</bdi>
    <button
      class="fullscreenOverlayHeaderCloseButton"
      aria-label="Close"
      title="Close"
      @click="$emit('close')"
    >
      <FontAwesomeIcon
        class="fullscreenOverlayHeaderCloseIcon"
        :icon="['fas', 'xmark']"
      />
    </button>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  title: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped src="./WatchFullscreenOverlayHeader.scss" lang="scss" />
