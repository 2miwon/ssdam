<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="$emit('closeModal')" @keyup.esc="$emit('closeModal')" tabindex="0">
    <div :class="['flex flex-col justify-center items-center w-[449px] gap-6 px-10 pt-[42px] pb-6 rounded-2xl bg-white', isMobile ? 'w-[360px]' : 'w-[449px]']"
      @click.stop>
      <div class="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <p class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center">
          <span class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#5743d0]">
            우측 하단
          </span>
          <span class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#1b1b1b]">
            의 설정 버튼을 눌러보세요!
          </span>
        </p>
        <p class="flex-grow-0 flex-shrink-0 w-64 text-lg font-medium text-center">
          <span class="flex-grow-0 flex-shrink-0 w-64 text-lg font-medium text-center text-[#5743d0]">
            책 맞춤 설정
          </span>
          <span class="flex-grow-0 flex-shrink-0 w-64 text-lg font-medium text-center text-[#474747]">
            을 완성하시면
          </span>
          <br/>
          <span class="flex-grow-0 flex-shrink-0 w-64 text-lg font-medium text-center text-[#474747]">
            초안의 품질이 더 좋아집니다!
          </span>
        </p>
      </div>
      
      <div class="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <div class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] relative gap-2.5 px-[18px] py-2 rounded-lg bg-[#5743d0] cursor-pointer hover:bg-[#6146FF]"
          @click="$emit('draftRecommend')">
          <p class="flex-grow-0 flex-shrink-0 text-base font-bold text-center text-white">초안 작성</p>
        </div>
        <div class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] relative gap-2.5 px-[18px] py-2 rounded-lg bg-white border border-[#f2f2f2] cursor-pointer hover:bg-gray-200"
          @click="$emit('closeModal')">
          <p class="flex-grow-0 flex-shrink-0 text-sm text-center text-[#474747]">돌아가기</p>
        </div>
        
      </div>
    </div>

    <div class="fixed bottom-[105px] right-5">
      <div class="flex flex-col justify-center items-start h-[47px] gap-4 px-4 py-[13px] rounded-[14px] bg-[#6146ff]">
        <div class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3">
          <p class="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-white">
            여기를 클릭해주세요!
          </p>
        </div>
      </div>
      <div class="fixed ml-[130px] mt-[-5px]">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none">
          <path
            d="M11.462 13.8948C10.6435 14.9466 9.04463 14.9187 8.26333 13.8389L1.17661 4.04553C0.210255 2.71008 1.18364 0.844599 2.8318 0.873368L17.3427 1.12666C18.9909 1.15543 19.8986 3.05374 18.8862 4.35465L11.462 13.8948Z"
            fill="#6146FF"
          ></path>
        </svg>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  emits: ['closeModal', 'draftRecommend'],
  data() {
    return {
      screenWidth: window.innerWidth,
    }
  },
  mounted() {
    this.$el.focus();
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight
    },
  },
  computed: {
    isMobile() {
      return this.screenWidth < 660
    },
  },
}
</script>