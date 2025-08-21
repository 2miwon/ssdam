<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
       @click="$emit('closeModal')" @keyup.esc="$emit('closeModal')" tabindex="0">
    <div
        :class="['flex flex-col justify-between items-center relative px-10 pt-[48px] pb-6 rounded-2xl bg-white', isMobile ? 'w-[360px] h-[250px]' : 'w-[449px] h-[269px]']"
         @click.stop>
      <div class="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <p class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#1b1b1b]">
          화면에 책의 <b class="text-[#5743d0]">모든 텍스트와 이미지</b>가
        </p>
        <p class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#1b1b1b]">
          들어간 것을 확인 후
        </p>
        
        <p class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#1b1b1b]">
          우측 상단의 <b class="text-[#5743d0]">내보내기</b> 버튼을 눌러주세요!
        </p>
      </div>
      <div class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] gap-[11px] w-full">
        <button class="flex justify-center items-center self-stretch flex-grow relative gap-2.5 px-[18px] py-2 rounded-lg bg-[#5743d0] border border-[#f2f2f2] text-base font-medium text-center text-white hover:cursor-pointer hover:bg-[#6146FF]"
            @click="$emit('closeModal')">
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['closeModal'],
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