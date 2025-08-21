<template>
  <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 ">
    <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2">
      <p class="flex-grow-0 flex-shrink-0 text-xs font-semibold text-left text-[#474747]">
        책의 주제는 무엇인가요?
      </p>
    </div>
    <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[218px] gap-4">
      <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 ">
        <textarea
            class="self-stretch flex-grow w-full h-[218px] px-5 py-4 rounded-md bg-[#fafbfc] border border-[#f2f2f2] text-[13px] text-[#474747] resize-none focus:outline-none"
            v-model="answer"
            :placeholder="placeholder"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      answer: '',
      placeholder: '책의 주제를 소개해 주세요'
    }
  },
  watch: {
    nowCategory(category) {
      this.category = category
    },
    answer(newValue) {
      this.$store.commit('SET_BOOK_TOPIC', newValue)
    }
  },
  mounted() {
    // 컴포넌트가 생성될 때 Vuex store에서 값을 가져옵니다.
    this.answer = this.$store.getters.bookTopic
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