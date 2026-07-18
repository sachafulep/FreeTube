<template>
  <div class="infoLine">
    <router-link
      v-if="channelId !== null"
      class="channelName"
      dir="auto"
      :to="`/channel/${channelId}`"
    >
      {{ channelName }}
    </router-link>
    <bdi
      v-else-if="channelName !== null"
      class="channelName"
      dir="auto"
    >
      {{ channelName }}
    </bdi>

    <span class="infoStats">
      <template v-if="viewCount != null">
        <font-awesome-icon :icon="['fas', 'play']" />
        <span class="viewCount">{{ compactViewCount }}</span>
      </template>

      <span
        v-if="uploadedTimeDisplay !== ''"
        class="uploadedTime"
      >{{ uploadedTimeDisplay }}</span>
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { formatNumber } from '../../helpers/utils'

export default defineComponent({
  name: 'FtVideoInfoLine',

  props: {
    channelId: { type: String, default: null },
    channelName: { type: String, default: null },
    viewCount: { type: Number, default: null },
    published: { type: Number, default: 0 },
    uploadedTime: { type: String, default: '' },
  },

  computed: {
    compactViewCount() {
      if (this.viewCount == null) return ''
      return formatNumber(this.viewCount, { notation: 'compact' })
    },

    uploadedTimeDisplay() {
      if (!this.published) return this.uploadedTime
      return this.narrowRelativeTime(this.published)
    },
  },

  methods: {
    narrowRelativeTime(date) {
      const now = Date.now()
      let diff = (now - date) / 1000
      let unit = 'second'
      if (diff >= 60) { diff /= 60; unit = 'minute' }
      if (unit === 'minute' && diff >= 60) { diff /= 60; unit = 'hour' }
      if (unit === 'hour' && diff >= 24) { diff /= 24; unit = 'day' }
      const days = diff
      if (unit === 'day' && diff >= 7) { diff /= 7; unit = 'week' }
      if (unit === 'week' && days >= 30) { diff = days / 30; unit = 'month' }
      if (unit === 'month' && diff >= 12) { diff /= 12; unit = 'year' }
      const locale = this.$i18n.locale
      return new Intl.RelativeTimeFormat([locale, 'en'], { style: 'narrow' }).format(Math.ceil(-diff), unit)
    },
  },
})
</script>

<style src="./FtVideoInfoLine.scss" lang="scss" />
