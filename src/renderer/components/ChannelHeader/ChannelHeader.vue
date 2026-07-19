<template>
  <FtCard>
    <div
      class="bannerContainer"
      :class="{ default: !bannerUrl }"
      :style="{ '--banner-url': `url('${bannerUrl}')` }"
    />
    <div class="info">
      <img
        v-if="thumbnailUrl"
        class="thumbnail"
        :src="thumbnailUrl"
        alt=""
      >
      <FontAwesomeIcon
        v-else
        class="thumbnail"
        :icon="['fas', 'circle-user']"
      />
      <div class="infoColumn">
        <h1
          class="name"
          dir="auto"
        >
          {{ name }}
        </h1>
        <div class="infoRow">
          <p v-if="subCount !== null">
            {{ formattedSubCount }}
          </p>
          <p>•</p>
          <p v-if="formattedVideoCount !== null">
            {{ formattedVideoCount }} {{ $t('Channel.Videos.Videos') }}
          </p>
        </div>
        <p
          v-if="description"
          v-safer-html="description"
          class="description"
        />
        <FtSubscribeButton
          :channel-id="id"
          :channel-name="name"
          :channel-thumbnail="thumbnailUrl"
        />
      </div>
    </div>
  </FtCard>
</template>

<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FtCard from '../ft-card/ft-card.vue'
import FtSubscribeButton from '../FtSubscribeButton/FtSubscribeButton.vue'
import { formatNumber } from '../../helpers/utils'
import { vSaferHtml } from '../../directives/vSaferHtml.js'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  subCount: {
    type: Number,
    default: null
  },
  videoCount: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
})

const formattedSubCount = computed(() => {
  const compact = formatNumber(props.subCount, { notation: 'compact', maximumSignificantDigits: 3 })
  return `${compact} subscribers`
})
const formattedVideoCount = computed(() => {
  if (props.videoCount === null) return null
  return formatNumber(props.videoCount)
})
</script>

<style scoped src="./ChannelHeader.css" />
