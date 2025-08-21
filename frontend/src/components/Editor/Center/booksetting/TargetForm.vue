<template>
  <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1">
    <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
      <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1">
        <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2">
          <p class="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#474747]">
            대상 독자를 알려주세요
          </p>
        </div>
        <div class="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[42px] relative gap-4 px-5 py-4 mb-[3px] rounded-md bg-[#fafbfc] border border-[#f2f2f2]">
          <textarea
              v-model="target"
              class="self-stretch flex-grow-0 flex-shrink-0 w-[518px] h-[42px] text-[13px] text-left text-[#474747] bg-transparent border-none resize-none py-[11px] focus:outline-none"
              :placeholder="this.placeholderOne"></textarea>
        </div>
      </div>
      <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[157px] gap-1">
        <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2">
          <p class="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#474747]">
            독자에 대한 추가 설명이 있나요?
          </p>
        </div>
        <div class="flex flex-col justify-start items-start self-stretch flex-grow relative gap-4 px-5 py-4 rounded-md bg-[#fafbfc] border border-[#f2f2f2]">
          <textarea
              v-model="description"
              class="self-stretch flex-grow w-full min-h-[42px] text-[13px] text-left text-[#474747] bg-transparent border-none resize-none focus:outline-none"
              :placeholder="this.placeholderTwo"
          ></textarea>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      target: '',
      description: '',
      placeholderOne: 'ex. 20-40대 직장인, 자기계발에 관심 있는 일반 독자',
      placeholderTwo: '설명을 추가해 주세요'
    }
  },
  watch: {
    target(newValue) {
      this.$store.commit('SET_BOOK_TARGET', newValue)
    },
    description(newValue) {
      this.$store.commit('SET_BOOK_TARGET_DESCRIPTION', newValue)
    }
  },
  mounted() {
    this.target = this.$store.getters.bookTarget
    this.description = this.$store.getters.bookTargetDescription
  }
}
</script>

<style lang="scss" scoped>

</style>