<template>
  <div class="flex justify-start items-center absolute flex-grow-0 flex-shrink-0 relative gap-2">
    <div class="flex-grow-0 flex-shrink-0 w-[35px] h-[35px] relative overflow-hidden rounded-lg bg-white border border-[#f2f2f2] cursor-pointer"
      @click="handleLeftClick">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 absolute left-[5px] top-1.5"
        preserveAspectRatio="none">
        <path
          d="M11.1818 12L15 15.8889L13.9091 17L9 12L13.9091 7L15 8.11111L11.1818 12Z"
          fill="#3D3D3D">
        </path>
      </svg>
    </div>

    <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
      <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#1b1b1b]">{{ leftNumber }}</p>
      <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#a8a8a8]">/</p>
      <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#a8a8a8]">{{ rightNumber }}</p>
    </div>

    <div class="flex-grow-0 flex-shrink-0 w-[35px] h-[35px] relative overflow-hidden rounded-lg bg-white border border-[#f2f2f2] cursor-pointer"
      @click="handleRightClick">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 absolute left-[5px] top-1.5"
        preserveAspectRatio="none">
        <path
          d="M12.8182 12L9 8.11111L10.0909 7L15 12L10.0909 17L9 15.8889L12.8182 12Z"
          fill="#333333">
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      leftNumber: {
        type: Number,
        required: true
      },
      rightNumber: {
        type: Number,
        required: true
      }
    },
    emits: ['leftClick', 'rightClick'],
    methods: {
      handleLeftClick() {
        this.$emit('leftClick')
      },
      handleRightClick() {
        this.$emit('rightClick')
      }
    }
    
  }
</script>