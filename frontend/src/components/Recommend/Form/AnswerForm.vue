<template>
  <div class="w-[66vw] mx-auto mb-7">
    <div class="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-2 rounded-3xl border-2 border-purple-500 flex items-center">
      <div class="flex-grow min-w-0 relative">
        <textarea
            :value="localAnswer"
            @input="onInput"
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
            @keypress.enter.prevent.stop="handleAnswer"
            @click.stop
            rows="1"
            :style="{ height: textareaHeight + 'px' }"
            :disabled="isOnboardingVisible"
            class="w-full resize-none outline-none bg-transparent py-[9px] px-2 text-base font-medium leading-normal"
        ></textarea>
        <div
            :class="['absolute left-2 text-gray-400 pointer-events-none', isMobile ? (nowIdx == 0 ? 'text-sm top-[3px]' : 'text-sm top-[11px]') : 'text-base top-2']"
            v-if="!displayValue" >
          {{ placeHolder }}
        </div>
      </div>
      <button :disabled="localAnswer.length === 0" @click.stop="handleAnswer"
              :class="['flex-shrink-0 ml-2', localAnswer.length === 0 ? 'cursor-not-allowed' : '']">
        <svg v-if="localAnswer == 0"
             width="24"
             height="24"
             viewBox="0 0 32 32"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
             class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
             preserveAspectRatio="none"
        >
          <g clip-path="url(#clip0_1344_387)">
            <path
                d="M4.75845 4.4526C4.43002 3.79572 4.69109 3.52688 5.36666 3.86466L29.3595 15.861C30.0238 16.1932 30.0307 16.7579 29.4024 17.1069L6.26642 29.9603C5.62587 30.3161 5.32134 30.0463 5.58448 29.3621L7.15395 17.0147L23.0199 16.4625L7.15395 15.9102L4.75845 4.4526Z"
                fill="#D9D9D9"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_1344_387"><rect width="32" height="32" fill="white"></rect></clipPath>
          </defs>
        </svg>
        <svg v-else
             width="32"
             height="33"
             viewBox="0 0 32 33"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
             class="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
             preserveAspectRatio="none"
        >
          <g clip-path="url(#clip0_1556_1304)">
            <path
                d="M4.75845 4.9526C4.43002 4.29572 4.69109 4.02688 5.36666 4.36466L29.3595 16.361C30.0238 16.6932 30.0307 17.2579 29.4024 17.6069L6.26642 30.4603C5.62587 30.8161 5.32134 30.5463 5.58448 29.8621L7.15395 17.5147L23.0199 16.9625L7.15395 16.4102L4.75845 4.9526Z"
                fill="#3E3E3E"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_1556_1304">
              <rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect>
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      localAnswer: '',
      textareaHeight: 40, // 초기 높이 설정
      composing: false, // IME 입력 상태 추적
      displayValue: '', // 화면에 표시할 값
    }
  },
  props: ['question', 'regen', 'answer', 'nowIdx', 'isOnboardingVisible'],
  emits: ['submit', 'handleRegen', 'handleMainTopicSubmit', 'handleMainQuestionSubmit', 'handleSubQuestionSubmit'],
  watch: {
    answer(newValue) {
      this.localAnswer = newValue;
      this.displayValue = newValue;
    },
    localAnswer(newValue) {
      this.displayValue = newValue;
    }

  },
  computed: {
    placeHolder() {
      if(this.nowIdx == 0)
        return "상단에 원하는 주제가 없다면 직접 입력해주세요."
      return "내용을 입력해주세요"
    },
    isMobile() {
      return window.innerWidth < 660
    },
  },
  methods: {
    handleAnswer() {
      setTimeout(() => {
        if(this.nowIdx == 0){
          if(this.localAnswer === '') return
          this.$emit('handleMainTopicSubmit', this.localAnswer)
        }else if(this.nowIdx == 1){
          this.$emit('handleMainQuestionSubmit', this.localAnswer)
        }else {
          this.$emit('handleSubQuestionSubmit', this.localAnswer)
        }
        this.localAnswer = ''
        this.textareaHeight = 40
      }, 200);
    },
    adjustTextareaHeight(e) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      this.textareaHeight = textarea.scrollHeight;
    },
    onInput(e) {
      this.adjustTextareaHeight(e);
      this.localAnswer = e.target.value;
      if (!this.composing) {
        this.displayValue = e.target.value;
      }
    },
    onCompositionStart() {
      this.composing = true;
    },
    onCompositionEnd(e) {
      this.composing = false;
      this.localAnswer = e.target.value;
      this.displayValue = e.target.value;
    },
  }

}
</script>

<style>
textarea {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

textarea::-webkit-scrollbar {
  display: none;  /* WebKit */
}
</style>
