<template>
  <div class="sidebarChapters">
    <div class="sidebarChaptersList">
      <div
        v-for="(chapter, index) in chapters"
        :key="index"
        class="sidebarChapter"
        :class="{ active: index === currentChapterIndex }"
        role="button"
        tabindex="0"
        @click="changeChapter(chapter.startSeconds)"
      >
        <img
          v-if="chapter.thumbnail"
          :src="chapter.thumbnail.url"
          class="sidebarChapterThumbnail"
          :class="{ active: index === currentChapterIndex }"
          alt=""
        >
        <div class="sidebarChapterInfo">
          <bdi class="sidebarChapterTitle">{{ chapter.title }}</bdi>
          <span class="sidebarChapterTimestamp">{{ chapter.timestamp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WatchSidebarChapters',

  props: {
    chapters: {
      type: Array,
      required: true,
    },
    currentChapterIndex: {
      type: Number,
      required: true,
    },
  },

  emits: ['timestamp-event'],

  methods: {
    changeChapter(startSeconds) {
      this.$emit('timestamp-event', startSeconds)
    },
  },
})
</script>

<style src="./WatchSidebarChapters.scss" lang="scss" />
