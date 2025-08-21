<template>
  <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1">
    <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2">
      <p class="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#474747]">
        개인 문체를 작성해 주세요
      </p>
    </div>
    <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[105px] gap-4"
      :class="[ isMobile ? 'mb-[113px]' : 'mb-[21px]']">
      <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
        <textarea
            class="self-stretch flex-grow w-full h-[105px] px-5 py-4 rounded-md bg-[#fafbfc] border border-[#f2f2f2] text-[13px] text-[#474747] resize-none focus:outline-none"
            v-model="answer"
            :placeholder="this.placeholder"
        ></textarea>
      </div>
    </div>
    <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2 px-2"
    :class="{ 'hidden': isMobile }">
      <p class="flex-grow-0 flex-shrink-0 text-xs font-bold text-left text-[#474747]">예시</p>
      <p class="flex-grow-0 flex-shrink-0 text-xs text-left text-[#474747]">
        <span class="flex-grow-0 flex-shrink-0 text-xs text-left text-[#474747]">
          • 생태학에 대해 깊이 있게 다루겠습니다. 독자 여러분께 도움이 되길 바랍니다.</span><br/>
        <span class="flex-grow-0 flex-shrink-0 text-xs text-left text-[#474747]">
          • 저의 일대기에 대해 재미있게 얘기해보려 해요. 부담 없이 함께 읽어봐요!</span><br />
        <span class="flex-grow-0 flex-shrink-0 text-xs text-left text-[#474747]">
          • 말만 번지르르하게 하지 말고, 결과로 보여줘. 아니면 지금이라도 손 털고 나가라.
        </span><br />
        <span class="flex-grow-0 flex-shrink-0 text-xs text-left text-[#474747]">
          • In this journey, 우리는 마음의 깊이를 탐구할 거예요. 함께 해요.</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      answer: '',
      placeholder: '생각이 나지 않으신다면, 현재 책에 작성하신 문장을 2문장 정도 적어주세요'
    }
  },
  watch: {
    answer(newValue) {
      this.$store.commit('SET_BOOK_STYLE', newValue)
    }
  },
  mounted() {
    // 컴포넌트가 생성될 때 Vuex store에서 값을 가져옵니다.
    this.answer = this.$store.getters.bookStyle
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    }
  }
}
</script>

<style lang="scss" scoped>

</style>