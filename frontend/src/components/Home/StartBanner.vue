<template>

  <div class="flex-shrink-0 flex flex-col justify-start items-center gap-[22px] sm:gap-[52px] pt-[82px] pb-[82px] lg:mb-[40px] sm:mb-0">
    <div class="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-[4px] sm:gap-6">
      <p class="flex-grow-0 flex-shrink-0 text-[30px] sm:text-[46px] font-bold text-center text-black">
        <span class="text-[35px] sm:hidden flex flex-col">
          <span>이야기를 쓰고</span>
          <span class="mt-[-0.15em]">생각을 담다</span>
        </span>
        <span class="hidden sm:inline">이야기를 쓰고, 생각을 담다</span>
      </p>
      <p class="hidden sm:inline flex-grow-0 flex-shrink-0 text-2xl font-medium text-center text-black/60">
        <span class="flex-grow-0 flex-shrink-0 text-[20px] sm:text-2xl font-medium text-center text-black/60">어려운 글감 선정부터 퇴고까지,</span><br/><span class="flex-grow-0 flex-shrink-0 text-2xl font-medium text-center text-black/60">글의 시작과 끝을 쓰담과 함께해요.</span>
      </p>
      <p class="sm:hidden flex-grow-0 flex-shrink-0 text-2xl font-medium text-center text-black/60">
        <span class="flex flex-col">
        <span class="flex-grow-0 flex-shrink-0 text-[15px] font-medium text-center text-black/60">어려운 글감 선정부터 퇴고까지,</span>
        <span class="mt-[-11px] flex-grow-0 flex-shrink-0 text-[15px] font-medium text-center text-black/60">글의 시작과 끝을 쓰담과 함께해요.</span>
        </span>
      </p>
    </div>
    <StartButton @click="handleStartFree"></StartButton>
  </div>
</template>

<script>

import StartButton from "@/components/Home/StartButton.vue";

export default {
  components: {
    StartButton
  },
  props: ['bannerTitle'],
  methods: {
    handleStartFree() {
      this.$router.push({ name: 'book' })
    }
  }
}
</script>
