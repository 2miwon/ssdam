<template>
  <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-4 px-4 rounded-[14px] bg-[#fafbfc] cursor-pointer"
    @click="handleClick" :class="{ 'pt-5 pb-2 border border-[#e3e6ea]':focused, 'py-5':!focused }">
    <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
      <div class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
        <div class="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[18px] w-[18px] relative gap-2.5 p-2.5 rounded-[100px] bg-[#e7edf2]">
          <p class="flex-grow-0 flex-shrink-0 w-1.5 text-[10px] font-semibold text-center text-[#727272]">
            {{ index+1 }}
          </p>
        </div>
        <p class="flex-grow w-[247px] text-sm font-semibold text-left text-[#1b1b1b]" :class="{ 'truncate': !focused}">
          {{ reason }}
        </p>
      </div>
      <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
        <div class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
          <div class="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2.5 py-1 rounded-[41px] border border-[#e7edf2]">
            <p class="flex-grow-0 flex-shrink-0 text-[10px] font-medium text-left text-[#727272]">
              수정
            </p>
          </div>
          <p class="flex-grow w-[235px] text-[13px] font-medium text-left text-[#474747]">
            {{ revisedText }}
          </p>
        </div>
        <div v-if="focused" class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
          <div class="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2.5 py-1 rounded-[41px] border border-[#e7edf2]">
            <p class="flex-grow-0 flex-shrink-0 text-[10px] font-medium text-left text-[#b3b7bc]">
              원문
            </p>
          </div>
          <p class="flex-grow w-[231px] text-[13px] font-medium text-left text-[#b3b7bc]">
            {{ originalText }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="focused" class="flex flex-col justify-start items-end self-stretch flex-grow-0 flex-shrink-0 relative gap-1.5">
      <svg
        width="277"
        height="1"
        viewBox="0 0 277 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="self-stretch flex-grow-0 flex-shrink-0"
        preserveAspectRatio="xMidYMid meet">
        <line y1="0.5" x2="277" y2="0.5" stroke="#F2F2F2"></line>
      </svg>
      <div class="flex justify-end items-center flex-grow-0 flex-shrink-0 relative gap-2">
        <svg @click="handleIgnore"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="flex-grow-0 flex-shrink-0 w-6 h-6 relative rounded-lg cursor-pointer hover:bg-gray-200"
          preserveAspectRatio="none">
          <path
            d="M15.5 7.8H19V9.2H17.6V18.3C17.6 18.6866 17.2866 19 16.9 19H7.1C6.7134 19 6.4 18.6866 6.4 18.3V9.2H5V7.8H8.5V5.7C8.5 5.3134 8.8134 5 9.2 5H14.8C15.1866 5 15.5 5.3134 15.5 5.7V7.8ZM16.2 9.2H7.8V17.6H16.2V9.2ZM9.9 6.4V7.8H14.1V6.4H9.9Z"
            fill="#727272">
          </path>
        </svg>
        <svg @click="handleApprove"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="flex-grow-0 flex-shrink-0 w-6 h-6 relative rounded-lg cursor-pointer hover:bg-gray-200"
          preserveAspectRatio="none">
          <path
            d="M10.25 14.6471L17.8333 7L19 8.17647L10.25 17L5 11.7059L6.16667 10.5295L10.25 14.6471Z"
            fill="#727272">
          </path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['index', 'reason', 'revisedText', 'focused', 'originalText'],
    emits: ['ignore', 'approve', 'focus'],
    methods: {
      handleClick() {
        this.$emit('focus')
      },
      handleIgnore() {
        this.$emit('ignore')
      },
      handleApprove() {
        this.$emit('approve')
      },
    },
  }
</script>