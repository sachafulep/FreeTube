<template>
  <div class="watchVideoInfoHeader">
    <h1
      class="videoTitle"
      dir="auto"
    >
      {{ title }}
    </h1>
    <div class="channelBlock">
      <RouterLink :to="`/channel/${channelId}`">
        <img
          :src="channelThumbnail"
          class="channelThumbnail"
          alt=""
        >
      </RouterLink>
      <div class="channelInfo">
        <RouterLink
          :to="`/channel/${channelId}`"
          class="channelName"
          dir="auto"
        >
          {{ channelName }}
        </RouterLink>
        <span class="subscriberCount">{{ subscriptionCountText }} subscribers</span>
      </div>
      <FtSubscribeButton
        :channel-id="channelId"
        :channel-name="channelName"
        :channel-thumbnail="channelThumbnail"
        :subscription-count-text="subscriptionCountText"
      />
    </div>
  </div>
</template>

<script setup>
import FtSubscribeButton from '../FtSubscribeButton/FtSubscribeButton.vue'

defineProps({
  title: { type: String, required: true },
  channelId: { type: String, required: true },
  channelName: { type: String, required: true },
  channelThumbnail: { type: String, required: true },
  subscriptionCountText: { type: String, required: true },
})
</script>

<style src="./WatchVideoInfoHeader.scss" lang="scss" />
