<template>
  <div class="commentLikeCount" v-if="likes !== ' ' || isHearted">
    <div class="commentLikeRow">
      <div
        v-if="likes !== ' '" 
        class="commentLikes"
        >
        <template v-if="likes !== ' '">
          <FontAwesomeIcon
            :icon="['fas', 'thumbs-up']"
          />
          <span>{{ likes }}</span>
        </template>
      </div>
      <span
        v-if="isHearted"
        class="commentHeartBadge"
      >
        <img
          :src="channelThumbnail"
          :title="$t('Comments.Hearted')"
          :aria-label="$t('Comments.Hearted')"
          class="commentHeartBadgeImg"
          alt=""
        >
        <FontAwesomeIcon
          :icon="['fas', 'heart']"
          class="commentHeartBadgeWhite"
        />
        <FontAwesomeIcon
          :icon="['fas', 'heart']"
          class="commentHeartBadgeRed"
        />
      </span>
    </div>
    <button
      v-if="!isReply && numReplies > 0"
      class="commentRepliesButton"
      @click="$emit('toggleReplies')"
    >
      <span>{{ numReplies }} replies</span>
      <FontAwesomeIcon
        :icon="['fas', 'chevron-down']"
        :class="{ commentRepliesChevronOpen: showReplies }"
      />
    </button>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useI18n } from '../../composables/use-i18n-polyfill'

useI18n()

defineProps({
  likes: {
    type: String,
    default: null
  },
  numReplies: {
    type: Number,
    required: true
  },
  isHearted: {
    type: Boolean,
    required: true
  },
  channelThumbnail: {
    type: String,
    required: true
  },
  hideCommentLikes: {
    type: Boolean,
    required: true
  },
  showReplies: {
    type: Boolean,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggleReplies'])
</script>

<style scoped src="./CommentLikeCount.css" />
