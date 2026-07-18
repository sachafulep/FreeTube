<template>
  <button
    class="showMoreRepliesButton"
    @click="$emit('click')"
  >
    <span>{{ $t("Comments.Show More Replies") }}</span>
    <FontAwesomeIcon :icon="['fas', 'chevron-down']" />
  </button>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useI18n } from 'vue-i18n'

useI18n()
defineEmits(['click'])
</script>

<style scoped src="./ShowMoreRepliesButton.css" />
