<template>
  <div class="w-full h-[76vh] rounded-lg flex flex-col relative">
    <OnBoardingMessage
        v-if="!checkRecommendWatched && showOnboardingRecommendTwo && subQuestionList[0]"
        class="absolute top-[-9%] left-[5%] 2xl:top-[-9%] 2xl:left-[5%] xl:top-[-9%] xl:left-[5%] lg:top-[-9%] lg:left-[5%] md:top-[-9%] md:left-[5%]"
        :pointerPosition="2"
        :message="'질문이 마음에 들지 않으신가요?'"
        :messageTwo="'우측 버튼을 클릭해 다른 질문으로 바꿔보세요!'"
        @close="handleCloseOnboardingRecommendTwo"
    />
    <div v-if="!isCreatedBookSchema" class="flex-grow overflow-hidden overflow-y-auto" ref="scrollContainer">
      <TopicQuestionBox/>
      <ButtonList :buttonList="topicList" @buttonClicked="handleButtonClick"/>

<!--      <div v-if="showMainTopic" ref="mainTopicElement">-->
<!--        <MainTopicAnswerBox :mainTopic="mainTopic"/>-->
<!--      </div>-->

      <div v-if="!isCreatedBookSchema && nowIdx == 1 || nowIdx == 2"
          :class="['w-[65vw] mx-auto min-h-15', isMainQuestionExpanded ? 'h-[66vh]' : 'h-[15vh]']"
          ref="mainQuestion">
        <MainQuestionBox :mainQuestion="mainQuestion"
                        :mainTopic="mainTopic"
                        :showMainQuestion="showMainQuestion"
                        :currentQuestionIndex="currentMainQuestionIndex"
                        :mainQuestionAnswer="mainQuestionAnswer"
                        @submit="handleMainQuestionRegen"/>
      </div>

      <div v-if="!isCreatedBookSchema && nowIdx == 2" class="w-[65vw] h-[66vh] mx-auto min-h-15 relative" ref="subQuestion">
        <SubQuestionListBox
                            :subQuestionAnswer="subQuestionAnswer"
                            :subQuestionIdx="subQuestionIdx"
                            :subAnswerIdx="subQuestionAnswerIdx"
                            @regenShowQuestion="handleRegenShowQuestion"
                            @isFinishedBookSchema="handleCreateBookSchema"/>
      </div>
    </div>
    <div v-if="isCreatedBookSchema" class="w-[65vw] h-[66vh] mx-auto flex-grow relative">
      <BookSchemaDisplay></BookSchemaDisplay>
    </div>
    <div v-else class="relative">
      <OnBoardingMessage
          v-if="!checkRecommendWatched && nowIdx == 1 && showOnboardingRecommendOne"
          class="absolute top-[-120%] left-[5%] 2xl:top-[-130%] 2xl:left-[8%] md:top-[-120%] md:left-[8%]"
          :pointerPosition="2"
          :message="'자세히 답변할수록 좋은 글감이 완성돼요!'"
          @close="handleCloseOnboardingRecommendOne"
      />
      <AnswerForm
                  @handleMainTopicSubmit="handleMainTopicSubmit"
                  @handleMainQuestionSubmit="handleMainQuestionSubmit"
                  @handleSubQuestionSubmit="handleSubQuestionSubmit"
                  v-model:answer="mainTopic"
                  :nowIdx="nowIdx"
                  :subQuestionIdx="subQuestionIdx"
                  :isOnboardingVisible="!checkRecommendWatched && (( nowIdx == 1 && showOnboardingRecommendOne) || ( nowIdx == 2 && showOnboardingRecommendTwo))"
                  class="flex-shrink-0"/>
    </div>
  </div>
</template>

<script>
import ButtonList from '@/components/Recommend/ButtonList.vue'
import TopicQuestionBox from "@/components/Recommend/QuestionBox/TopicQuestionBox.vue";
// import MainTopicAnswerBox from "@/components/Recommend/MainTopicAnswerBox.vue";
import MainQuestionBox from "@/components/Recommend/QuestionBox/MainQuestionBox.vue";
import SubQuestionListBox from "@/components/Recommend/QuestionBox/SubQuestionListBox.vue";
import BookSchemaDisplay from "@/components/Recommend/BookSchemaDisplay.vue";
import { getTopicList } from "@/components/Recommend/Constants/topic";
import AnswerForm from "@/components/Recommend/Form/AnswerForm.vue";
import OnBoardingMessage from "@/components/OnBoardingMessage.vue";

export default {

  data() {
    return {
      topicQuestion: '이야기 하고 싶은 분야를 알려주세요! 3번의 단계만 거치면 글감을 찾을 수 있어요!',
      topicList: getTopicList(),
      showQuestion: [0,1,2],
      mainTopic: '',

      nowIdx: 0,
      showCloseModal: false,

      llmRequested: false,
      showMainTopic: false,
      showMainQuestion: false,

      isMainQuestionExpanded: true,

      currentMainQuestionIndex: 0,
      mainQuestionAnswer: '',

      subQuestionAnswer: '',
      subQuestionIdx: 0,
      subQuestionAnswerIdx: -1,

      isCreatedBookSchema: false,
      showOnboardingRecommendOne: true,
      showOnboardingRecommendTwo: true,
      showOnboardingRecommendThree: true,
    }
  },

  mounted() {
    this.nowIdx = 0
    this.llmRequested = false
    this.showMainTopic = false
    this.isMainQuestionExpanded = true
    this.currentMainQuestionIndex = 0
    this.mainQuestionAnswer = ''
    this.subQuestionAnswer = ''
    this.subQuestionIdx = 0
    this.subQuestionAnswerIdx = -1
    this.isCreatedBookSchema = false
    this.$store.commit('RESET_RECOMMEND_PROCESS')
  },

  computed: {
    mainQuestionList(){
      return this.$store.getters.mainQuestionList
    },
    mainQuestion(){
      this.scrollToMainQuestion()
      return this.$store.getters.mainQuestionList[this.currentMainQuestionIndex]
    },
    recommendProcess(){
      return this.$store.getters.recommendProcess
    },
    subQuestionList(){
      return this.$store.getters.subQuestionList
    },
    checkRecommendWatched() {
      return this.$store.getters.checkRecommendWatched
    }
  },

  components: {
    OnBoardingMessage,
    ButtonList,
    TopicQuestionBox,
    // MainTopicAnswerBox,
    MainQuestionBox,
    SubQuestionListBox,
    BookSchemaDisplay,
    AnswerForm
  },
  methods: {
    handleButtonClick(buttonName) {
      this.mainTopic = buttonName
    },
    async handleMainTopicSubmit(answer) {
      this.sendGtagEvent('recommend_step_1', {
        main_topic: answer
      });

      if(this.llmRequested) {
        alert('생성 중입니다! 잠시만 기다려주세요!')
        return
      }
      this.llmRequested = true
      this.showMainTopic = true
      this.nowIdx = 1
      this.mainTopic = answer
      await this.$nextTick()
      // this.scrollToMainTopic()
      this.scrollToMainQuestion()
      this.$store.commit('NEXT_RECOMMEND_PROCESS')
      this.mainTopic = ''
      setTimeout(() => {
        this.showMainQuestion = true
        this.$store.commit('SET_TOPIC', answer)
        this.$store.commit('SET_MAIN_QUESTION_LIST', [answer + "에 대해 독자들에게 공유하고 싶은 핵심 메시지는 무엇인가요?"])
      }, 800);
      // await this.$store.dispatch('setMainQuestionList', answer)
      this.llmRequested = false
    },
    async handleMainQuestionSubmit(answer){
      this.sendGtagEvent('recommend_step_2_1', {
        question: this.mainQuestion,
        answer: answer
      });
      this.mainQuestionAnswer = answer
      if (this.llmRequested) {
        alert('생성 중입니다! 잠시만 기다려주세요!')
        return
      } else {
        this.llmRequested = true
        this.nowIdx = 2
        this.isMainQuestionExpanded = false

        try {
          await this.$store.dispatch('setSubQuestionList', {
            answer: answer,
            index: this.currentMainQuestionIndex
          })
          this.llmRequested = false
          this.scrollToSubQuestion()
        } catch (error) {
          console.error(error)
          window.location.reload()
          this.$store.commit('SET_ERROR_MESSAGE', '목차 구성 중 오류가 발생했습니다.')
          this.$store.commit('SET_SHOW_ERROR_MODAL', true)
        }
      }
    },
    async handleSubQuestionSubmit(answer) {
      this.$store.dispatch('addToSectionList', {
        question: this.subQuestionList[this.showQuestion[this.subQuestionIdx]],
        answer: answer
      })
      this.$store.dispatch('storeRecommendationData', {
        question : this.subQuestionList[this.showQuestion[this.subQuestionIdx]],
        answer : answer
      })
      this.sendGtagEvent(`recommend_step_2_${this.subQuestionIdx + 2}`, {
        question: this.mainQuestion,
        answer: answer
      });
      this.subQuestionIdx++
      this.subQuestionAnswerIdx++
      this.subQuestionAnswer = answer
  },
    scrollToMainTopic() {
      const mainTopicElement = this.$refs.mainTopicElement
      const scrollContainer = this.$refs.scrollContainer
      if (mainTopicElement && scrollContainer) {
        mainTopicElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    scrollToMainQuestion(){
      const mainQuestion = this.$refs.mainQuestion
      const scrollContainer = this.$refs.scrollContainer
      if (mainQuestion && scrollContainer) {
        mainQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    scrollToSubQuestion(){
      const subQuestion = this.$refs.subQuestion
      const scrollContainer = this.$refs.scrollContainer
      if (subQuestion && scrollContainer) {
        subQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    handleMainQuestionRegen() {
      this.currentMainQuestionIndex = (this.currentMainQuestionIndex + 1)%this.mainQuestionList.length
    },
    handleCreateBookSchema(){
      this.$store.commit("NEXT_RECOMMEND_PROCESS")
      this.isCreatedBookSchema = true
    },
    handleCloseOnboardingRecommendOne(){
      this.showOnboardingRecommendOne = false
    },
    handleCloseOnboardingRecommendTwo(){
      this.showOnboardingRecommendTwo = false
    },
    sendGtagEvent(eventName, eventParams) {
      this.$gtag.event(eventName, eventParams);
    },
    handleRegenShowQuestion(value){
      this.showQuestion = value
      // console.log('??')
      // console.log(this.showQuestion)
    }
  },
}
</script>
