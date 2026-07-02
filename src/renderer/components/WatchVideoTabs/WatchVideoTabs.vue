<template>
  <div
    class="tabs"
    role="tablist"
    :aria-label="$t('Video.Video Tabs')"
  >
    <button
      type="button"
      class="tab"
      role="tab"
      :aria-selected="modelValue === 'suggested'"
      :class="{ selectedTab: modelValue === 'suggested' }"
      @click="changeTab('suggested')"
    >
      {{ $t("Video.Suggested Videos") }}
    </button>

    <button
      type="button"
      class="tab"
      role="tab"
      :aria-selected="modelValue === 'comments'"
      :class="{ selectedTab: modelValue === 'comments' }"
      @click="changeTab('comments')"
    >
      {{ $t("Comments.Comments") }}
    </button>
  </div>
</template>

<script setup>
const modelValue = defineModel({ type: String, required: true })

function changeTab(tab) {
  modelValue.value = tab
}
</script>

<style scoped src="./WatchVideoTabs.css" />
