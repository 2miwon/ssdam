<template>
  <div class="w-screen h-screen"
    :style="{ filter: isDarkMode ? 'invert(100%) hue-rotate(180deg)' : '' }">
    <TopBanner class="fixed w-full h-[55px] z-10 no-print"/>
    <div>
      <RouterView class="fixed w-full h-[calc(100%-55px)] mt-[55px]"/>
    </div>
  </div>
</template>

<script>
import TopBanner from '@/components/Top/TopBanner.vue'

export default {
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode
    },
  },
  components: {
    TopBanner
  },
}
</script>