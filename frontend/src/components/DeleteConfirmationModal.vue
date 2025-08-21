<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
       @click="$emit('closeModal')" @keyup.esc="$emit('closeModal')" tabindex="0">
    <div
        :class="['flex flex-col justify-between items-center relative px-10 pt-[72px] pb-6 rounded-2xl bg-white', isMobile ? 'w-[360px] h-[250px]' : 'w-[449px] h-[269px]']"
         @click.stop>
      <div class="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <p class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#1b1b1b]">
          {{ confirmMainMessage }}
        </p>
        <span></span>
        <p class="flex-grow-0 flex-shrink-0 text-base text-center text-[#1b1b1b]/[0.57]">
          <span class="flex-grow-0 flex-shrink-0 text-base text-center text-[#1b1b1b]/[0.57]">
            {{ confirmSubMessage }}
          </span>
        </p>
      </div>
      <div class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] gap-[11px] w-full">
        <button class="flex justify-center items-center self-stretch flex-grow relative gap-2.5 px-[18px] py-2 rounded-lg bg-white border border-[#f2f2f2] text-base font-medium text-center text-[#1b1b1b] hover:bg-gray-200"
                @click="$emit('closeModal')">
          돌아가기
        </button>
        <button class="flex justify-center items-center self-stretch flex-grow relative gap-2.5 px-[18px] py-2 rounded-lg bg-red-500 text-base font-medium text-center text-white hover:bg-red-600"
                @click="$emit('deleteBook')">
          삭제하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mainMessage', 'subMessage'],
  emits: ['closeModal', 'deleteBook'],
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
    },
  },
  computed: {
    confirmMainMessage() {
      return this.mainMessage
    },
    confirmSubMessage() {
      return this.subMessage
    },
    isMobile() {
      return this.screenWidth < 660
    },
  },
}
</script>