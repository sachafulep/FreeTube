<template>
  <div class="sidebarChapters">
    <div ref="chaptersList" class="sidebarChaptersList">
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
    isVisible: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['timestamp-event'],

  watch: {
    isVisible(visible) {
      if (visible) {
        this.$nextTick(this.scrollToCurrentChapter)
      }
    },
    currentChapterIndex() {
      if (this.isVisible) {
        this.scrollToCurrentChapter()
      }
    },
  },

  methods: {
    changeChapter(startSeconds) {
      this.$emit('timestamp-event', startSeconds)
    },

    scrollToCurrentChapter() {
      const container = this.$refs.chaptersList
      const currentItem = container?.children[this.currentChapterIndex]
      if (currentItem != null) {
        container.scrollTop = currentItem.offsetTop - container.offsetTop
      }
    },
  },
})
</script>

<style src="./WatchSidebarChapters.scss" lang="scss" />
