<template>
  <RecommendLayout/>
</template>

<script>
import RecommendLayout from "@/components/Recommend/RecommendLayout.vue";

export default {
  components: {
    RecommendLayout,
  },
  data() {
    return {
      screenWidth: window.innerWidth
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    isMobile() {
      return this.screenWidth < 660
    }
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth
    }
  },
}
</script>