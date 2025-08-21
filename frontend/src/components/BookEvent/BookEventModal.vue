<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" tabindex="0">
    <div class="fixed flex flex-col justify-start items-center bg-[#cacaf1] rounded-lg overflow-y-auto z-10"
      :class="{ 'h-[70%] w-[90%]':isMobile, 'h-[80%] w-[60%]':!isMobile }">
      <div class="flex w-full justify-end items-center pt-2 pr-2">
        <svg @click ="exitEvent"
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 relative cursor-pointer"
          preserveAspectRatio="xMidYMid meet">
          <rect x="0.5" y="0.5" width="32" height="32" rx="16" fill="#cacaf1"></rect>
          <path
            d="M16.4997 15.5865L20.7424 11.3438C21.1329 10.9533 21.7661 10.9533 22.1566 11.3438C22.5471 11.7343 22.5471 12.3675 22.1566 12.758L17.9139 17.0007L22.1566 21.2433C22.5471 21.6338 22.5471 22.267 22.1566 22.6575C21.7661 23.048 21.1329 23.048 20.7424 22.6575L16.4997 18.4149L12.2571 22.6575C11.8665 23.048 11.2334 23.048 10.8429 22.6575C10.4523 22.267 10.4523 21.6338 10.8429 21.2433L15.0855 17.0007L10.8428 12.758C10.4523 12.3675 10.4523 11.7343 10.8429 11.3438C11.2334 10.9533 11.8665 10.9533 12.2571 11.3438L16.4997 15.5865Z"
            fill="#000000">
          </path>
        </svg>
      </div>

      <div class="flex-1 flex items-center justify-center w-full">
        <img alt="book-event" class="max-w-full max-h-full object-contain" src="../../../public/assets/bookWritingPoster.png" />
      </div>

      <div class="flex w-full justify-between pl-4 pr-4 pb-4">
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="dontShow"
            class="w-5 h-5 text-[#5743d0] border-gray-300 rounded focus:ring-[#5743d0] cursor-pointer"
            @click="toggleCheckBox"/>
          <label for="dontShow" class="text-base font-medium text-black cursor-pointer">
            오늘 하루 보지 않기
          </label>
        </div>
        <button class="flex justify-center items-center relative px-[18px] py-2 rounded-lg bg-[#5743d0] text-base font-medium text-center text-white hover:bg-[#6146FF] transition duration-200"
          @click="handleJoinProject">
          지금 참여하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noShowForToday: false,
      }
    },
    computed: {
      isMobile() {
        return window.innerWidth < 660;
      }
    },
    emits: ['exitEvent'],
    methods: {
      exitEvent() {
        this.$emit('exitEvent', this.noShowForToday);
      },
      toggleCheckBox() {
        this.noShowForToday = !this.noShowForToday;
        this.$emit('exitEvent', this.noShowForToday);
      },
      handleJoinProject() {
        window.open('https://donhdonot.notion.site/5-01afb6b610394ea78a0a7cf06c8f105a?pvs=4', '_blank');
      }
    }
  }
</script>
