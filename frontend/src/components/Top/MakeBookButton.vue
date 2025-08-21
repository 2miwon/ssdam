<template>
  <div class="flex justify-start items-center relative">
    <svg
      width="1"
      height="13"
      viewBox="0 0 1 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-grow-0 flex-shrink-0"
      preserveAspectRatio="xMidYMid meet">
      <line x1="0.5" y1="12.5" x2="0.499999" y2="0.5" stroke="#F2F2F2"></line>
    </svg>
    <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[110px] h-[37px] relative gap-1 p-2.5 rounded-lg hover:bg-gray-600 cursor-pointer"
      :class="{ 'bg-[#474747]':true }">
      <svg v-if="!this.showPrintModal"
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-[18px] h-[18px] relative"
        preserveAspectRatio="none">
        <path
          d="M11.36 11.9496L11.1375 11.973V15.5C11.1375 15.8521 10.8521 16.1375 10.5 16.1375H3C2.64792 16.1375 2.3625 15.8521 2.3625 15.5V3.5C2.3625 3.14792 2.64792 2.8625 3 2.8625H6.75C7.10208 2.8625 7.3875 3.14792 7.3875 3.5V3.6125H7.5H10.5C10.8258 3.6125 11.0947 3.85698 11.1328 4.17241L11.1476 4.29451L11.2679 4.26894L13.3521 3.82594C13.6965 3.75274 14.035 3.97257 14.1082 4.31696L16.2913 14.5875C16.3644 14.9319 16.1446 15.2704 15.8003 15.3436L12.8658 15.9674C12.5214 16.0406 12.1829 15.8207 12.1097 15.4763L11.36 11.9496ZM7.5 4.8875H7.3875V5V11V11.1125H7.5H9.75H9.8625V11V5V4.8875H9.75H7.5ZM7.3875 14.75V14.8625H7.5H9.75H9.8625V14.75V12.5V12.3875H9.75H7.5H7.3875V12.5V14.75ZM6.1125 4.25V4.1375H6H3.75H3.6375V4.25V11.75V11.8625H3.75H6H6.1125V11.75V4.25ZM6.1125 13.25V13.1375H6H3.75H3.6375V13.25V14.75V14.8625H3.75H6H6.1125V14.75V13.25ZM12.9757 12.8772L12.8656 12.9005L12.889 13.0106L13.2009 14.4777L13.2243 14.5877L13.3343 14.5643L14.8015 14.2524L14.9116 14.229L14.8882 14.119L14.5763 12.652L14.553 12.5419L14.4429 12.5653L12.9757 12.8772ZM12.5772 11.5434L12.6006 11.6534L12.7106 11.63L14.1778 11.3182L14.2879 11.2948L14.2645 11.1847L13.0169 5.31566L12.9936 5.20562L12.8835 5.22901L11.4164 5.54088L11.3063 5.56427L11.3297 5.67431L12.5772 11.5434Z"
          fill="white"
          stroke="#474747"
          stroke-width="0.225">
        </path>
      </svg>
      <p class="flex-grow-0 flex-shrink-0 text-[13px] font-bold text-left text-white ">
        {{ this.showPrintModal ? '에디터로 돌아가기' : '책 내보내기' }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['disabled'],
    computed: {
      showPrintModal() {
        return this.$store.getters.showPrintModal
      },
    }
  }
</script>