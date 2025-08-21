<template>
    <div class="w-full h-[5vh] flex justify-between items-center bg-gradient-to-t from-white to-white relative p-4">
      <div class="w-32 h-6 flex justify-center flex-grow items-center gap-1 inline-flex">

        <div>
          <div v-if="localIdx==1">
            <div class="w-6 h-6 relative bg-[#5743d0] rounded-3xl">
              <div class="left-[9px] top-[6px] absolute text-center text-white text-xs font-bold font leading-none">1</div>
            </div>
          </div>
          <div v-else>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                preserveAspectRatio="xMidYMid meet"
            >
              <rect width="24" height="24" rx="12" fill="#D6D8DC"></rect>
              <path
                  d="M9.91869 14.7114L7.17719 12.0464L6 13.1907L9.91869 17L18 9.14432L16.8228 8L9.91869 14.7114Z"
                  fill="white"
              ></path>
            </svg>
          </div>
        </div>

        <div class="w-3.5 h-px border border-zinc-100"></div>

        <div>
          <div v-if="localIdx==1">
            <div class="flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded-[38px] bg-gray-300">
              <p class="absolute left-2 top-[3px] text-xs font-bold text-center text-white">2</p>
            </div>
          </div>
          <div v-else-if="localIdx==2">
            <div class="flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded-[38px] bg-[#5743d0]">
              <p class="absolute left-2 top-[3px] text-xs font-bold text-center text-white">2</p>
            </div>
          </div>
          <div v-else>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                preserveAspectRatio="xMidYMid meet"
            >
              <rect width="24" height="24" rx="12" fill="#D6D8DC"></rect>
              <path
                  d="M9.91869 14.7114L7.17719 12.0464L6 13.1907L9.91869 17L18 9.14432L16.8228 8L9.91869 14.7114Z"
                  fill="white"
              ></path>
            </svg>
          </div>
        </div>

        <div class="w-3.5 h-px border border-zinc-100"></div>

        <div>
          <div v-if="localIdx==3">
            <div class="flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded-[38px] bg-[#5743d0]">
              <p class="absolute left-2 top-[3px] text-xs font-bold text-center text-white">3</p>
            </div>
          </div>
          <div v-else>
            <div class="w-6 h-6 relative bg-gray-300 rounded-3xl">
              <div class="left-[8px] top-[6px] absolute text-center text-white text-xs font-bold font leading-none">3</div>
            </div>
          </div>
        </div>

      </div>
      <CloseButton @closeClicked="handleCloseRecommendClicked" class="flex-shrink-0 cursor-pointer"/>
      <RecommendCloseModal v-if="showRecommendCloseModal" @closeModal="handleCloseRecommendModalClosed"/>
    </div>
</template>

<script>
import CloseButton from "@/components/Recommend/RecommendModal/CloseButton.vue";
import RecommendCloseModal from "@/components/Recommend/RecommendModal/RecommendCloseModal.vue";
export default {
  data() {
    return {
      topicQuestion: '이야기 하고 싶은 분야를 알려주세요! 3번의 단계만 거치면 글감을 찾을 수 있어요!',
    }
  },
  computed:{
    localIdx(){
      return this.$store.getters.recommendProcess
    },
    showRecommendCloseModal(){
      return this.$store.getters.showRecommendCloseModal
    }
  },
  methods:{
    handleCloseRecommendClicked(){
      this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 1)
    },
    handleCloseRecommendModalClosed(){
      this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 0)
    }
  },
  components: {
    CloseButton,
    RecommendCloseModal
  }

}
</script>
<!-- 
<style lang="scss" scoped>

</style> -->

