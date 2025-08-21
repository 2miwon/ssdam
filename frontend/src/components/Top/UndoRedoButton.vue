<template>
  <div class="flex justify-start items-start relative gap-3">
    <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[30px] h-[30px] rounded-lg" :class="{ 'cursor-pointer hover:bg-[#f2f2f2]':undoAvailable }" @click="handleUndo">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
        preserveAspectRatio="none">
        <path v-if="undoAvailable"
          d="M5.69025 5.833H11.6666C14.428 5.833 16.6666 8.07158 16.6666 10.833C16.6666 13.5945 14.428 15.833 11.6666 15.833H4.16659V17.4997H11.6666C15.3485 17.4997 18.3333 14.5149 18.3333 10.833C18.3333 7.1511 15.3485 4.16634 11.6666 4.16634H5.69025L7.80325 2.05339L6.62467 0.874878L2.49992 4.99967L6.62467 9.12446L7.80325 7.94595L5.69025 5.833Z"
          fill="#494949">
        </path>
        <path v-else
          d="M5.69025 5.833H11.6666C14.428 5.833 16.6666 8.07158 16.6666 10.833C16.6666 13.5945 14.428 15.833 11.6666 15.833H4.16659V17.4997H11.6666C15.3485 17.4997 18.3333 14.5149 18.3333 10.833C18.3333 7.1511 15.3485 4.16634 11.6666 4.16634H5.69025L7.80325 2.05339L6.62467 0.874878L2.49992 4.99967L6.62467 9.12446L7.80325 7.94595L5.69025 5.833Z"
          fill="#B9B9B7">
        </path>
      </svg>
    </div>
    <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[30px] h-[30px] rounded-lg" :class="{ 'cursor-pointer hover:bg-[#f2f2f2]':redoAvailable }"  @click="handleRedo">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
        preserveAspectRatio="none">
        <path v-if="redoAvailable"
          d="M15.143 5.833H9.16667C6.40524 5.833 4.16667 8.07158 4.16667 10.833C4.16667 13.5945 6.40524 15.833 9.16667 15.833H16.6667V17.4997H9.16667C5.48477 17.4997 2.5 14.5149 2.5 10.833C2.5 7.1511 5.48477 4.16634 9.16667 4.16634H15.143L13.03 2.05339L14.2086 0.874878L18.3333 4.99967L14.2086 9.12446L13.03 7.94595L15.143 5.833Z"
          fill="#494949">
        </path>
        <path v-else
          d="M15.143 5.833H9.16667C6.40524 5.833 4.16667 8.07158 4.16667 10.833C4.16667 13.5945 6.40524 15.833 9.16667 15.833H16.6667V17.4997H9.16667C5.48477 17.4997 2.5 14.5149 2.5 10.833C2.5 7.1511 5.48477 4.16634 9.16667 4.16634H15.143L13.03 2.05339L14.2086 0.874878L18.3333 4.99967L14.2086 9.12446L13.03 7.94595L15.143 5.833Z"
          fill="#B9B9B7">
        </path>
      </svg>
    </div>

  </div>
</template>

<script>
  export default {
    computed: {
      undoAvailable() {
        return this.$store.getters.undoAvailable
      },
      redoAvailable() {
        return this.$store.getters.redoAvailable
      },
    },
    methods: {
      handleUndo() {
        this.$store.commit('SET_PASS_UNDO', true)
      },
      handleRedo() {
        this.$store.commit('SET_PASS_REDO', true)
      },
    },
  }
</script>