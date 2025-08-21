<template>
  <div class="flex-grow-0 flex-shrink-0 text-xl text-left text-[#1b1b1b] gap-4">
    <div v-if="!localSubQuestionList[0]" class="flex items-center justify-center pt-[120px]">
      <img src="../../../../public/assets/progress.gif" alt="로딩중" class="w-auto h-auto">
    </div>
    <div v-else class="flex flex-col">
      <div v-for="(questionIndex, index) in showQuestion"
        :key="index"
        :class="['py-20', isAnswerVisible[index] ? 'border-b-2 opacity-50' : '']"
        :ref="'question' + index">
        <div v-if="isRegenerating && this.localSubQuestionIdx == index" class="flex items-center justify-start">
          <img src="../../../../public/assets/progress.gif" alt="로딩중" :class="['w-auto h-auto px-24']">
        </div>
        <div v-else-if="isQuestionVisible[index]" class="flex-col">
            <div class="flex">
            <span :class="['font-bold', isMobile ? 'text-sm pr-[10px]' : '']"> {{localSubQuestionList[questionIndex]}} </span>
            <svg v-if="!isAnswerVisible[index]" @click="handleRegen(index)"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              :class="['flex-grow-0 flex-shrink-0 w-8 h-8 cursor-pointer', isMobile ? '' : 'ml-8']"
              preserveAspectRatio="xMidYMid meet">
              <rect class="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 ease-in-out opacity-100 hover:opacity-0" rx="16" fill="#F8F8F8"></rect>
              <rect class="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" rx="16" fill="rgb(229 231 235)"></rect>
              <path
                d="M13.3985 14.504H10.1931L10.1942 14.494C10.3386 13.7871 10.6212 13.1156 11.0257 12.5182C11.6277 11.6312 12.4721 10.9361 13.4582 10.5158C13.7921 10.3742 14.1404 10.2659 14.4954 10.194C15.2316 10.0447 15.9904 10.0447 16.7266 10.194C17.7848 10.4108 18.7557 10.9342 19.5185 11.6988L21.0842 10.1376C20.3785 9.43177 19.5437 8.86832 18.6251 8.47796C18.1566 8.27963 17.6696 8.12851 17.1711 8.02684C16.1427 7.81788 15.0827 7.81788 14.0542 8.02684C13.5554 8.12893 13.0679 8.28042 12.5991 8.47907C11.2176 9.0652 10.0349 10.0382 9.19356 11.2809C8.62733 12.1188 8.23135 13.0599 8.02817 14.0506C7.99721 14.1999 7.98062 14.3525 7.95851 14.504H4.55298L8.97574 18.9267L13.3985 14.504ZM17.8213 16.7154H21.0267L21.0256 16.7242C20.7367 18.1414 19.9013 19.3879 18.7003 20.1939C18.103 20.5987 17.4315 20.8813 16.7244 21.0253C15.9885 21.1746 15.2301 21.1746 14.4942 21.0253C13.7873 20.881 13.1158 20.5984 12.5184 20.1939C12.225 19.9954 11.951 19.7696 11.7002 19.5194L10.1367 21.0828C10.8427 21.7885 11.678 22.3516 12.5969 22.7414C13.0657 22.9404 13.5555 23.0919 14.0509 23.1925C15.079 23.4016 16.1386 23.4016 17.1667 23.1925C19.1487 22.7811 20.8921 21.6129 22.0262 19.9362C22.5919 19.0989 22.9875 18.1586 23.1905 17.1687C23.2204 17.0194 23.2381 16.8668 23.2602 16.7154H26.6668L22.244 12.2926L17.8213 16.7154Z"
                fill="#B9B9B7">
              </path>
            </svg>
            </div>
            <div
                :class="['flex-grow-0 flex-shrink-0 font-medium text-left text-black pt-4', isMobile ? 'text-sm pr-[10px]' : 'text-base']"
                v-if="isAnswerVisible[index]">
              <div>{{localSubAnswerList[index]}}</div>
            </div>
        </div>
      </div>
    </div>
    <div ref="waitingBookSchema" >
      <div v-if="waitingCreateBookSchema" class="flex flex-col items-center justify-center h-[30vh]">
        <img src="../../../../public/assets/progress.gif" alt="로딩중" class="w-auto h-auto">
        <p class="text-sm font-semibold text-center text-[#474747]">글감 제출 중</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      // 만약 api에서 질문이 3개 미만이라면 오류가 날 수 있음
      showQuestion: [0,1,2],
      waitQuestion: '',
      questionWaiting: 0,
      isRegenerating: false,


      localSubQuestionList: [],
      localSubQuestionIdx: '',
      localSubAnswer: '',
      localSubAnswerIdx: '',

      isQuestionVisible: [true, false, false],
      isAnswerVisible: [false, false, false],
      waitingCreateBookSchema: false,
    }
  },
  props: ['subQuestionAnswer', 'subQuestionIdx', 'subAnswerIdx'],
  emits: ['isFinishedBookSchema', 'regenShowQuestion'],

  methods: {
    handleRegen(index) {
      this.isRegenerating = true;
      setTimeout(() => {
        this.isRegenerating = false;
        if (this.localSubAnswerList[index] == '') {
          this.waitQuestion.push(this.showQuestion[index])
          this.showQuestion[index] = this.waitQuestion[0]
          this.waitQuestion.shift()
        }
        this.$emit("regenShowQuestion", this.showQuestion)
      }, 200);
    },
    async scrollToSubQuestion(index) {
      await this.$nextTick();
      const questionElement = this.$refs['question' + index];
      if (questionElement && Array.isArray(questionElement) && questionElement.length > 0 && index < 3) {
        questionElement[0].scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    },

    async scrollToWaitingBookSchema() {
      this.waitingCreateBookSchema = true
      await this.$nextTick()
      const waitingBookSchema = this.$refs.waitingBookSchema
      waitingBookSchema.scrollIntoView({behavior: 'smooth', block: 'start'});
    },

    async waitForSectionCompletion(){
      return new Promise(resolve => {
        const checkSection = () => {
          if (this.$store.getters.sectionInProgressCount == 0) {
            resolve();
          } else {
            setTimeout(checkSection, 100);
          }
        };
        checkSection();
      });
    },

  },
  computed: {
      subQuestionList() {
          return this.$store.getters.subQuestionList
        },
      localSubAnswerList() {
        return this.$store.getters.subQuestionList.map(() => '')
      },
      isMobile() {
        return window.innerWidth < 660
      }
  },

  watch: {
    subQuestionIdx: {
      async handler(newValue) {
        await this.scrollToSubQuestion(newValue)
        this.isQuestionVisible[newValue] = true
        this.localSubQuestionIdx = newValue
      },
      immediate: true
    },
    subQuestionList: {
      handler(){
        this.localSubQuestionList =  this.$store.getters.subQuestionList
        this.waitQuestion = Array.from({ length: this.$store.getters.subQuestionList.length - 3 }, (v, i) => i + 3)
      }
    },
    subQuestionAnswer: {
      handler(newValue) {
        this.localSubAnswer = newValue
        // if (this.subQuestionIdx == 0)
        //   return;
        // console.log(this.showQuestion)
        // console.log(this.localSubAnswer)
        // this.$store.dispatch('storeRecommendationData', { question: this.localSubQuestionList[this.subQuestionIdx -1], answer: this.localSubAnswer })
      },
      immediate: true
    },
    subAnswerIdx: {
      async handler(newValue) {

        this.localSubAnswerIdx = newValue
        this.isAnswerVisible[this.localSubAnswerIdx] = true
        this.localSubAnswerList[this.localSubAnswerIdx] = this.localSubAnswer

        if(newValue == 2) {
          await this.scrollToWaitingBookSchema()
        }

        if(newValue == 2){
          // 섹션 생성이 완료될 때까지 기다림
          await this.waitForSectionCompletion();
          this.$store.dispatch('updateBookSettingByChapterData')
          await this.$store.dispatch('finalRecommendation')
          this.waitingCreateBookSchema = false
          this.$emit("isFinishedBookSchema")
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>