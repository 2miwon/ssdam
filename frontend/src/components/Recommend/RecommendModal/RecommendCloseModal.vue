<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    @click="$emit('closeModal')" @keyup.esc="$emit('closeModal')" tabindex="0">
    <div
        :class="['flex flex-col justify-between items-center relative px-10 pt-[72px] pb-6 rounded-2xl bg-white', isMobile ? 'w-[360px] h-[250px]' : 'w-[449px] h-[269px]']"
      @click.stop>
      <div class="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <p class="flex-grow-0 flex-shrink-0 text-lg font-bold text-center text-[#1b1b1b]">
          글감 선정을 건너뛰시겠습니까?
        </p>
        <p class="flex-grow-0 flex-shrink-0 text-base text-center text-[#1b1b1b]/[0.57]">
          <span class="flex-grow-0 flex-shrink-0 text-base text-center text-[#1b1b1b]/[0.57]">
            나가시면 이전의 내용은
          </span>
          <br/>
          <span class="flex-grow-0 flex-shrink-0 text-base text-center text-[#1b1b1b]/[0.57]">
            저장되지 않습니다
          </span>
        </p>
      </div>
      <div class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] gap-[11px] w-full">
        <button class="flex justify-center items-center self-stretch flex-grow relative gap-2.5 px-[18px] py-2 rounded-lg bg-white border border-[#f2f2f2] text-base font-medium text-center text-[#1b1b1b]"
          @click="$emit('closeModal')">
          돌아가기
        </button>
        <button class="flex justify-center items-center self-stretch flex-grow relative gap-2.5 px-[18px] py-2 rounded-lg bg-black text-base font-medium text-center text-white"
          @click="exitRecommend">
          건너뛰기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['closeModal'],
  methods: {
    exitRecommend() {
      const currentPageId = this.$store.getters.currentBook.book_schema.main_chapter.page_id
      this.$store.commit('SET_BOOK_SCHEMA', {
        main_chapter: {
          title: '',
          page_id: currentPageId,
          sub_chapter_list: [],
        },
      });
      if(this.$store.getters.showRecommendCloseModal == 1) {
        this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 0)
        this.$store.commit('RESET_RECOMMEND_PROCESS')
        this.$router.push({ name: 'editor' })
      }
      else {
        this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 0)
        this.$store.commit('RESET_RECOMMEND_PROCESS')
        this.$router.push({ name: 'book' })
      }
    },
  },
  mounted() {
    this.$el.focus();
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    },
  }
}
</script>