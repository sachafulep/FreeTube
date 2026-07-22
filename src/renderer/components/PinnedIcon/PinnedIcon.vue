<template>
  <div class="pinnedIconContainer">
    <FontAwesomeIcon
      :icon="['fas', 'thumbtack']"
      class="pinnedIcon"
      title="Pinned"
    />
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<style scoped src="./PinnedIcon.css" />

