<template>
  <div class="flex justify-center mt-auto mb-5 items-center relative gap-2.5 pl-2.5 pr-2.5 py-2.5 rounded w-[88%] mx-auto hover:bg-gray-200 cursor-pointer"
    @click="handleTrashButtonClick">
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-grow-0 flex-shrink-0"
      preserveAspectRatio="none">
      <path
        d="M14.6166 3.90033V3.95033H14.6666H19.2833V5.71699H17.4666H17.4166V5.76699V17.9003C17.4166 18.3882 17.0212 18.7837 16.5333 18.7837H3.46663C2.97878 18.7837 2.58329 18.3882 2.58329 17.9003V5.76699V5.71699H2.53329H0.716626V3.95033H5.33329H5.38329V3.90033V1.10033C5.38329 0.612478 5.77878 0.216992 6.26663 0.216992H13.7333C14.2212 0.216992 14.6166 0.612478 14.6166 1.10033V3.90033ZM15.65 5.76699V5.71699H15.6H4.39996H4.34996V5.76699V16.967V17.017H4.39996H15.6H15.65V16.967V5.76699ZM7.19996 1.98366H7.14996V2.03366V3.90033V3.95033H7.19996H12.8H12.85V3.90033V2.03366V1.98366H12.8H7.19996Z"
        fill="#474747"
        stroke="white"
        stroke-width="0.1">
      </path>
    </svg>
    <p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-[#474747]">휴지통</p>
  </div>
  <div v-if="showTrashBin">
    <TrashBin @closeModal="handleCloseModal"/>
  </div>
</template>

<script>
import TrashBin from '@/components/Editor/Left/TrashBin.vue'

  export default {
    components: {
      TrashBin
    },
    data() {
      return {
        showTrashBin: false
      }
    },
    methods: {
      handleTrashButtonClick() {
        this.showTrashBin = true
      },
      handleCloseModal() {
        this.showTrashBin = false
      }
    },
    
  }
</script>
