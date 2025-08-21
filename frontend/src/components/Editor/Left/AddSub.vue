<template>
  <div class="flex justify-center mt-3 mb-3 items-center relative gap-2.5 pl-2.5 pr-2.5 py-2.5 rounded bg-[#f7f7f6]/[0.97] w-[88%] mx-auto hover:bg-gray-200 cursor-pointer"
    @click="handleNewSection">
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-grow-0 flex-shrink-0 w-[18px] h-[18px] relative"
      preserveAspectRatio="none">
      <rect x="0.5" y="0.5" width="18" height="18" rx="9" fill="#1B1B1B"></rect>
      <path
        d="M8.9638 8.58977V5.37549H10.0352V8.58977H13.2495V9.6612H10.0352V12.8755H8.9638V9.6612H5.74951V8.58977H8.9638Z"
        fill="white"></path>
    </svg>
    <p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-[#1b1b1b]">대목차 추가</p>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

  export default {
    methods: {
      async handleNewSection() {
        await this.$store.dispatch('addSubChapter')
        await this.$store.dispatch('saveCurrentBookState', {
          bookContent: cloneDeep(this.$store.getters.currentBook.book_schema),
          pageContent: null,
          currentBlockIndex: null,
          currentBlockOffset: null,
        })
        this.$store.commit('SET_EDITOR_LEFT_FOLDED', true)
      },
    },
    
  }
</script>
