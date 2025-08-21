<template>
  <div class="w-full h-full bg-gray-50 flex items-center justify-center">
    <OnBoardingMessage
      v-if="!checkRecommendWatched&&recommendProcess==3&&showOnboardingRecommendThree"
      class="absolute top-[10px] right-[330px]"
      :pointerPosition="1"
      :message="'목차를 원하는대로 수정하셨다면,'"
      :messageTwo="'집필하기 버튼을 눌러 집필을 시작하세요!'"
    @close="handleShowOnboardingRecommendThree"/>
    <div :class="['w-[80vw] h-[86vh] bg-white rounded-2xl shadow mb-[60px] border', isMobile ? 'p-6' : 'p-8']">
      <RecommendTopBanner>
      </RecommendTopBanner>
      <RecommendInsideContainer>
      </RecommendInsideContainer>
    </div>
    <RecommendErrorModal v-if="showErrorMessage" :message="errorMessage" class="fixed top-[60px] bg-white p-4 shadow-lg z-50"/>
  </div>
</template>

<script>
import RecommendInsideContainer from "@/components/Recommend/RecommendInsideContainer.vue";
import RecommendTopBanner from "@/components/Recommend/RecommendTopBanner.vue";
import OnBoardingMessage from "@/components/OnBoardingMessage.vue";
import RecommendErrorModal from "@/components/Recommend/RecommendModal/RecommendErrorModal.vue";

export default {
  data() {
    return {
      showOnboardingRecommendThree: true,
      showErrorMessage: false
    }
  },
  computed: {
    checkRecommendWatched() {
      return this.$store.getters.checkRecommendWatched
    },
    recommendProcess() {
      return this.$store.getters.recommendProcess
    },
    isMobile() {
      return window.innerWidth < 660
    },
    showErrorModal() {
      return this.$store.getters.showErrorModal
    },
    errorMessage() {
      return this.$store.getters.errorMessage
    }
  },
  watch: {
    showErrorModal(value) {
      if (value) {
        this.showErrorMessage = true
        setTimeout(() => {
          this.showErrorMessage = false
          this.$store.commit('SET_SHOW_ERROR_MODAL', false)
        }, 2000)
      }
    }
  },
  components: {
    RecommendInsideContainer,
    RecommendTopBanner,
    OnBoardingMessage,
    RecommendErrorModal
  },
  methods: {
    handleShowOnboardingRecommendThree(){
      this.$store.dispatch('updateUser',0)
      this.showOnboardingRecommendThree = false
    }
  },
  mounted() {
    if (this.showErrorModal) {
      this.showErrorMessage = true
      setTimeout(() => {
        this.showErrorMessage = false
        this.$store.commit('SET_SHOW_ERROR_MODAL', false)
      }, 2000)
    }
  }
}
</script>