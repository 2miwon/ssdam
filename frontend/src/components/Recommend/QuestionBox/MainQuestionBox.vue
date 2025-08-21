<template>
  <div
      :class="['flex-grow-0 flex-shrink-0 text-xl text-left text-[#1b1b1b] gap-4 pt-6 pb-10', localMainQuestionAnswer ? 'border-b-2 opacity-50' : '']"
  >
    <div v-if="!showMainQuestion" class="flex items-center justify-center">
      <img src="../../../../public/assets/progress.gif" alt="로딩중" class="w-auto h-auto">
    </div>
    <div v-else class="flex items-center ">
      <div v-if="isRegenerating" class="flex items-center justify-start">
        <img src="../../../../public/assets/progress.gif" alt="로딩중" class="w-auto h-44 px-24">
      </div>
      <div v-else class="flex items-center justify-start">
        <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-[27px] py-2 rounded-[39px]" style="background: linear-gradient(129.78deg, #4343d0 19.07%, #900afa 93.09%);">
          <p :class="['flex-grow-0 flex-shrink-0 font-semibold text-left text-white', isMobile ? 'text-sm' : 'text-base']">{{ localMainTopic }}</p>
        </div>
        <span :class="['pl-2 pr-[10px] font-bold', isMobile ? 'text-sm' : '']">{{localMainQuestion}}</span>
<!--        <svg v-if="!localMainQuestionAnswer" @click="handleRegen"-->
<!--          width="32"-->
<!--          height="32"-->
<!--          viewBox="0 0 32 32"-->
<!--          fill="none"-->
<!--          xmlns="http://www.w3.org/2000/svg"-->
<!--          class="flex-grow-0 flex-shrink-0 w-8 h-8 ml-8"-->
<!--          preserveAspectRatio="xMidYMid meet"-->
<!--        >-->
<!--          <rect width="32" height="32" rx="16" fill="#F8F8F8"></rect>-->
<!--          <path-->
<!--              d="M13.3985 14.504H10.1931L10.1942 14.494C10.3386 13.7871 10.6212 13.1156 11.0257 12.5182C11.6277 11.6312 12.4721 10.9361 13.4582 10.5158C13.7921 10.3742 14.1404 10.2659 14.4954 10.194C15.2316 10.0447 15.9904 10.0447 16.7266 10.194C17.7848 10.4108 18.7557 10.9342 19.5185 11.6988L21.0842 10.1376C20.3785 9.43177 19.5437 8.86832 18.6251 8.47796C18.1566 8.27963 17.6696 8.12851 17.1711 8.02684C16.1427 7.81788 15.0827 7.81788 14.0542 8.02684C13.5554 8.12893 13.0679 8.28042 12.5991 8.47907C11.2176 9.0652 10.0349 10.0382 9.19356 11.2809C8.62733 12.1188 8.23135 13.0599 8.02817 14.0506C7.99721 14.1999 7.98062 14.3525 7.95851 14.504H4.55298L8.97574 18.9267L13.3985 14.504ZM17.8213 16.7154H21.0267L21.0256 16.7242C20.7367 18.1414 19.9013 19.3879 18.7003 20.1939C18.103 20.5987 17.4315 20.8813 16.7244 21.0253C15.9885 21.1746 15.2301 21.1746 14.4942 21.0253C13.7873 20.881 13.1158 20.5984 12.5184 20.1939C12.225 19.9954 11.951 19.7696 11.7002 19.5194L10.1367 21.0828C10.8427 21.7885 11.678 22.3516 12.5969 22.7414C13.0657 22.9404 13.5555 23.0919 14.0509 23.1925C15.079 23.4016 16.1386 23.4016 17.1667 23.1925C19.1487 22.7811 20.8921 21.6129 22.0262 19.9362C22.5919 19.0989 22.9875 18.1586 23.1905 17.1687C23.2204 17.0194 23.2381 16.8668 23.2602 16.7154H26.6668L22.244 12.2926L17.8213 16.7154Z"-->
<!--              fill="#B9B9B7"-->
<!--          ></path>-->
<!--        </svg>-->
      </div>
    </div>
    <div v-if="localMainQuestionAnswer" class="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-black pt-4">
      <div>{{localMainQuestionAnswer}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      localMainTopic: '',
      localMainQuestion: '',
      localCurrentQuestionIndex: 0,
      localMainQuestionAnswer: '',
      isRegenerating: false,
    }
  },
  mounted() {
    this.localMainTopic = this.mainTopic
  },
  props: ['mainTopic', 'mainQuestion','mainQuestionList', 'currentQuestionIndex', 'mainQuestionAnswer', 'showMainQuestion'],
  methods:{
    handleRegen(){
      this.isRegenerating = true;
      setTimeout(() => {
        this.isRegenerating = false;
        this.$emit('submit');
      }, 200);
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    }
  },
  watch: {
    mainQuestion: {
      handler(newValue) {
        this.localMainQuestion = String(newValue).substring(this.localMainTopic.length);
      },
      deep: true,
      immediate: true
    },
    currentQuestionIndex: {
      handler(newValue) {
        this.localCurrentQuestionIndex = newValue;
      },
      immediate: true
    },
    mainQuestionAnswer: {
      handler(newValue) {
        this.localMainQuestionAnswer = newValue;
        this.$store.dispatch('storeRecommendationData', { question: this.localMainTopic + this.localMainQuestion, answer: this.localMainQuestionAnswer } )
      }
    }
  },
}
</script>