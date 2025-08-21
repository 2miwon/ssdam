<template>
  <div class="w-full h-[290px] sm:h-[440px] self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden bg-[#1f0079]">
    <div class="flex flex-col justify-start items-center py-[50px] sm:py-[100px] md:py-[100px] gap-6 sm:gap-[52px]">
      <div class="flex flex-col justify-start items-center relative gap-4 sm:gap-6">
        <p class="flex-grow-0 flex-shrink-0 text-2xl sm:text-[46px] font-bold text-center text-white px-4">
          지금 바로 작가가 되어보세요
        </p>
      </div>
      <StartButton @click="handleStartFree"></StartButton>
    </div>
    <div class="absolute bottom-0 left-0 w-full px-4 sm:px-8">
      <div class="relative">
        <hr class="border-t border-indigo-700 w-full sm:w-[calc(100%-60px)] absolute left-1/2 transform -translate-x-1/2">
      </div>
      <div class="pl-[32px] text-violet-300 text-xs pt-[20px]">
        <a class="hover:underline" href="https://donhdonot.notion.site/de7d1ab66f1c40288efce989657e68c9?pvs=4">개인정보 처리방침</a>
        <span> | </span>
        <a class="hover:underline" href="https://donhdonot.notion.site/950d8c282fd24e23904552d0667edb00?pvs=4">서비스 이용약관</a>
      </div>
      <div>
        <p class="pl-[32px] pt-1.5>" style="font-size:12px; color:rgb(196, 181, 253)">
          쓰담 | 사업자등록번호 546-18-02469 | 대표 김준형
        </p>
      </div>
      <div class="pl-[32px] pb-5 text-violet-300 text-sm">
        Copyright ⓒ 2024 ssdam All Rights Reserved.
      </div>
    </div>
  </div>
</template>
<script>
import StartButton from "@/components/Home/StartButton.vue";

export default {
  components: {StartButton},
  methods: {
    handleStartFree() {
      this.$router.push({ name: 'book' })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>