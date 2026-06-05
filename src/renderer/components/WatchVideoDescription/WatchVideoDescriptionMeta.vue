<template>
  <div class="descriptionMeta">
    <span
      v-if="viewCount != null"
      class="descriptionViewCount"
    >{{ formattedViewCount }} views</span>
    <span class="descriptionDate">{{ formattedDate }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumber, getRelativeTimeFromDate } from '../../helpers/utils'

const props = defineProps({
  published: { type: Number, required: true },
  viewCount: { type: Number, default: null },
})

const formattedDate = computed(() => {
  return getRelativeTimeFromDate(props.published)
})

const formattedViewCount = computed(() => {
  return formatNumber(props.viewCount, { notation: 'compact' })
})
</script>

<style src="./WatchVideoDescriptionMeta.scss" lang="scss" />
