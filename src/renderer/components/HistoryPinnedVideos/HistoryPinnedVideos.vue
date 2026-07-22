<template>
  <template v-if="pinnedHistory.length > 0">
    <h2 class="pinnedHeading">
      <FontAwesomeIcon
        :icon="['fas', 'thumbtack']"
        class="headingIcon"
      />
      Pinned Videos
    </h2>
    <FtElementList
      class="pinnedList"
      :data="pinnedHistory"
      data-type="video"
      :show-video-with-last-viewed-playlist="true"
      :use-channels-hidden-preference="false"
      :hide-forbidden-titles="false"
    />
    <hr class="pinnedDivider">
  </template>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'

import FtElementList from '../FtElementList/FtElementList.vue'

import store from '../../store'

const pinnedHistory = computed(() => store.getters.getHistoryCacheSorted.filter(item => item.isPinned))
</script>

<style scoped src="./HistoryPinnedVideos.css" />

