<template>
  <nav class="searchTopNav">
    <div
      v-if="!hideSearchBar"
      ref="searchContainer"
      class="searchContainer"
    >
      <FtInput
        ref="searchInput"
        :placeholder="t('Search / Go to URL')"
        class="searchInput"
        is-search
        :data-list="activeDataList"
        :data-list-properties="activeDataListProperties"
        show-clear-text-button
        show-data-when-empty
        @input="getSearchSuggestionsDebounce"
        @click="goToSearch"
        @clear="clearLastSuggestionQuery"
        @remove="removeSearchHistoryEntryInDbAndCache"
      />
    </div>
  </nav>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, ref, useTemplateRef } from 'vue'
import { useI18n } from '../../composables/use-i18n-polyfill'

import FtInput from '../FtInput/FtInput.vue'

import store from '../../store/index'

import { KeyboardShortcuts, SEARCH_RESULTS_DISPLAY_LIMIT } from '../../../constants'
import { debounce, openInternalPath } from '../../helpers/utils'
import { clearLocalSearchSuggestionsSession, getLocalSearchSuggestions } from '../../helpers/api/local'
import { getInvidiousSearchSuggestions } from '../../helpers/api/invidious'

const { t } = useI18n()

/** @type {import('vue').ShallowRef<string[]>} */
const searchSuggestionsDataList = shallowRef([])
const lastSuggestionQuery = ref('')

/** @type {import('vue').ComputedRef<boolean>} */
const hideSearchBar = computed(() => store.getters.getHideSearchBar)
/** @type {import('vue').ComputedRef<boolean>} */
const enableSearchSuggestions = computed(() => store.getters.getEnableSearchSuggestions)

const usingOnlySearchHistoryResults = computed(() => lastSuggestionQuery.value.length === 0)

/** @type {import('vue').ComputedRef<string[]>} */
const latestMatchingSearchHistoryNames = computed(() => {
  return store.getters.getLatestMatchingSearchHistoryNames(lastSuggestionQuery.value)
})

/** @type {import('vue').ComputedRef<string[]>} */
const latestSearchHistoryNames = computed(() => store.getters.getLatestSearchHistoryNames)

const activeDataList = computed(() => {
  if (usingOnlySearchHistoryResults.value) {
    return latestSearchHistoryNames.value
  }

  const searchResults = [...latestMatchingSearchHistoryNames.value]

  if (enableSearchSuggestions.value) {
    for (const searchSuggestion of searchSuggestionsDataList.value) {
      if (latestMatchingSearchHistoryNames.value.includes(searchSuggestion)) {
        continue
      }

      searchResults.push(searchSuggestion)

      if (searchResults.length === SEARCH_RESULTS_DISPLAY_LIMIT) {
        break
      }
    }
  }

  return searchResults
})

const activeDataListProperties = computed(() => {
  const searchHistoryEntriesCount = usingOnlySearchHistoryResults.value
    ? latestSearchHistoryNames.value.length
    : latestMatchingSearchHistoryNames.value.length

  const properties = []

  for (let i = 0; i < activeDataList.value.length; i++) {
    properties.push(i < searchHistoryEntriesCount
      ? { isRemoveable: true, iconName: 'clock-rotate-left' }
      : { isRemoveable: false, iconName: 'magnifying-glass' }
    )
  }

  return properties
})

/** @type {import('vue').ComputedRef<any>} */
const searchSettings = computed(() => store.getters.getSearchSettings)

const searchInput = useTemplateRef('searchInput')

/**
 * @param {string} queryText
 * @param {object} options
 * @param {MouseEvent} options.event
 */
function goToSearch(queryText, { event }) {
  const doCreateNewWindow = event && event.shiftKey

  searchInput.value.blur()

  clearLocalSearchSuggestionsSession()

  store.dispatch('getYoutubeUrlInfo', queryText).then((result) => {
    switch (result.urlType) {
      case 'video': {
        const { videoId, timestamp, playlistId } = result

        const query = {}
        if (timestamp) {
          query.timestamp = timestamp
        }
        if (playlistId && playlistId.length > 0) {
          query.playlistId = playlistId
        }

        openInternalPath({
          path: `/watch/${videoId}`,
          query,
          doCreateNewWindow,
          searchQueryText: queryText,
        })
        break
      }

      case 'playlist': {
        const { playlistId, query } = result

        openInternalPath({
          path: `/playlist/${playlistId}`,
          query,
          doCreateNewWindow,
          searchQueryText: queryText,
        })
        break
      }

      case 'search': {
        const { searchQuery, query } = result

        openInternalPath({
          path: `/search/${encodeURIComponent(searchQuery)}`,
          query,
          doCreateNewWindow,
          searchQueryText: searchQuery,
        })
        break
      }

      case 'hashtag': {
        const { hashtag } = result
        openInternalPath({
          path: `/hashtag/${encodeURIComponent(hashtag)}`,
          doCreateNewWindow,
          searchQueryText: `#${hashtag}`,
        })

        break
      }

      case 'post': {
        const { postId, query } = result

        openInternalPath({
          path: `/post/${postId}`,
          query,
          doCreateNewWindow,
          searchQueryText: queryText,
        })
        break
      }

      case 'channel': {
        const { channelId, subPath, url } = result

        openInternalPath({
          path: `/channel/${channelId}/${subPath}`,
          doCreateNewWindow,
          query: {
            url,
          },
          searchQueryText: queryText,
        })
        break
      }

      case 'trending':
      case 'subscriptions':
      case 'history':
      case 'userplaylists':
        openInternalPath({
          path: `/${result.urlType}`,
          doCreateNewWindow,
          searchQueryText: queryText
        })
        break

      case 'invalid_url':
      default: {
        openInternalPath({
          path: `/search/${encodeURIComponent(queryText)}`,
          query: {
            prioritize: searchSettings.value.prioritize,
            time: searchSettings.value.time,
            type: searchSettings.value.type,
            duration: searchSettings.value.duration,
            features: [...searchSettings.value.features],
          },
          doCreateNewWindow,
          searchQueryText: queryText,
        })
      }
    }

    if (doCreateNewWindow) {
      updateSearchInputText('')
    }
  })
}

function clearLastSuggestionQuery() {
  lastSuggestionQuery.value = ''
}

/**
 * @param {string} text
 */
function updateSearchInputText(text) {
  searchInput.value?.setText(text)
}

/**
 * @param {string} query
 */
function getSearchSuggestionsDebounce(query) {
  if (query === lastSuggestionQuery.value) {
    return
  }

  lastSuggestionQuery.value = query

  if (enableSearchSuggestions.value) {
    debounceSearchResults(query.trim())
  }
}

/** @type {import('vue').ComputedRef<'local' | 'invidious'>} */
const backendPreference = computed(() => store.getters.getBackendPreference)
/** @type {import('vue').ComputedRef<boolean>} */
const backendFallback = computed(() => store.getters.getBackendFallback)

const debounceSearchResults = debounce(/** @param {string} query */(query) => {
  if (!process.env.SUPPORTS_LOCAL_API || backendPreference.value === 'invidious') {
    getSearchSuggestionsInvidious(query)
  } else {
    getSearchSuggestionsLocal(query)
  }
}, 200)

/**
 * @param {string} query
 */
async function getSearchSuggestionsLocal(query) {
  searchSuggestionsDataList.value = query.length > 0
    ? await getLocalSearchSuggestions(query)
    : []
}

async function getSearchSuggestionsInvidious(query) {
  if (query === '') {
    searchSuggestionsDataList.value = []
    return
  }

  try {
    searchSuggestionsDataList.value = (await getInvidiousSearchSuggestions(query)).suggestions
  } catch (err) {
    console.error(err)

    if (process.env.SUPPORTS_LOCAL_API && backendFallback.value) {
      console.error(
        'Error gettings search suggestions.  Falling back to Local API'
      )
      getSearchSuggestionsLocal(query)
    }
  }
}

/**
 * @param {string} query
 */
function removeSearchHistoryEntryInDbAndCache(query) {
  store.dispatch('removeSearchHistoryEntry', query)
  store.commit('removeFromSessionSearchHistory', query)
}

/**
 * @param {KeyboardEvent} event
 */
function handleKeyboardShortcuts(event) {
  const ctrlOrCommandPressed = (process.platform !== 'darwin' && event.ctrlKey) ||
    (process.platform === 'darwin' && event.metaKey)

  if (
    !hideSearchBar.value &&
    (
      (ctrlOrCommandPressed && (event.key === 'L' || event.key === 'l' || event.key === 'F' || event.key === 'f')) ||
      (event.altKey && (event.key === 'D' || event.key === 'd' || (process.platform === 'darwin' && event.key === '∂')))
    )
  ) {
    event.preventDefault()

    // In order to prevent Klipper's "Synchronize contents of the clipboard
    // and the selection" feature from being triggered when running
    // Chromium on KDE Plasma, it seems both focus() focus and
    // select() have to be called asynchronously (see issue #2019).
    setTimeout(() => {
      searchInput.value?.focus()
      searchInput.value?.select()
    }, 0)
  }
}

onMounted(() => {
  if (process.env.IS_ELECTRON) {
    window.addEventListener('keydown', handleKeyboardShortcuts)

    window.ftElectron.handleUpdateSearchInputText((searchQueryText) => {
      if (searchQueryText) {
        updateSearchInputText(searchQueryText)
      }
    })
  }
})

onBeforeUnmount(() => {
  if (process.env.IS_ELECTRON) {
    window.removeEventListener('keydown', handleKeyboardShortcuts)

    window.ftElectron.handleUpdateSearchInputText(null)
  }
})
</script>

<style scoped lang="scss" src="./SearchTopNav.scss" />
