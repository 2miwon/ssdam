<template>
  <div :class="['flex justify-start items-center gap-2',depth==0 ? 'py-3' : 'py-1', isMobile ? 'h-29' : 'h-29']"
    draggable="true"
    @dragstart="onDragStart"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop">
    <div
        :class="['flex justify-end items-start flex-grow-0 flex-shrink-0 w-10 relative gap-0.5', isMobile ? 'w-[21px]' : 'w-10']">
      <div class="items-center justify-center flex-shrink-0 flex-grow-0 rounded-lg cursor-pointer hover:bg-gray-200">
        <svg v-if="depth != 2"
          @click="createChapter"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="['flex-grow-0 flex-shrink-0 relative', isMobile ? 'w-5 h-5' : 'w-6 h-6']"
          preserveAspectRatio="none">
          <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="#B9B9B7"></path>
        </svg>
      </div>
      <div v-if='!isMobile' class="flex-grow-0 flex-shrink-0 w-3.5 h-6 relative rounded-[3px] cursor-pointer">
        <div v-if="depth != 0" class="justify-center grid grid-cols-2 grid-rows-3 gap-0.5 absolute left-1 top-[7px]">
          <div v-for="i in 6" :key="i">
            <svg
              width="2"
              height="2"
              viewBox="0 0 2 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flex-grow-0 flex-shrink-0"
              preserveAspectRatio="xMidYMid meet">
              <circle cx="1" cy="1" r="1" fill="#B9B9B7"></circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-auto">
      <div
          :class="['flex justify-between items-center flex-grow-0 w-full relative p-3 rounded-[10px] bg-[#f8f8f8] border border-[#f2f2f2]', isMobile ? 'h-auto' : 'h-auto']">
        <div v-if="!isEditing" @dblclick="startEditing"  class="flex justify-start items-center flex-grow-0 w-full relative gap-4">
          <div :class="['flex-grow-0 flex-shrink-0 w-[3px] h-6', `${bandColor[depth]}`]"></div>
          <p :class="['flex-grow-0 font-bold text-left text-[#1b1b1b] break-words', isMobile ? 'text-[12px]' : 'text-base' ]">
            {{ (depth == 1 ? (index + 1 + '. ') : '') + (editTitle || '제목 없음') }}
          </p>
        </div>
        <input
            v-else
            v-model="editTitle"
            @blur="finishEditing"
            @keyup.enter="finishEditing"
            class="flex-grow text-base font-bold text-left text-[#1b1b1b] bg-transparent outline-none border-b border-[#1b1b1b]"
            :style="{ width: `${editTitle.length}ch` }"
            ref="editInput"
        />
        <div v-if="isDeleteAvailable[depth]" @click="$emit('handleDelete')" class="relative w-8 h-8 group cursor-pointer">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="flex-grow-0 flex-shrink-0 w-full h-full relative"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect class="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0" rx="7.5" fill="white"></rect>
            <rect class="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100" rx="7.5" fill="rgb(229 231 235)"></rect>
            <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#F2F2F2"></rect>
            <path
              d="M15.9997 14.0865L20.2424 9.84382C20.6329 9.4533 21.2661 9.4533 21.6566 9.84382C22.0471 10.2343 22.0471 10.8675 21.6566 11.258L17.4139 15.5007L21.6566 19.7433C22.0471 20.1338 22.0471 20.767 21.6566 21.1575C21.2661 21.548 20.6329 21.548 20.2424 21.1575L15.9997 16.9149L11.7571 21.1575C11.3665 21.548 10.7334 21.548 10.3429 21.1575C9.95233 20.767 9.95233 20.1338 10.3429 19.7433L14.5855 15.5007L10.3428 11.258C9.95232 10.8675 9.95233 10.2343 10.3429 9.84382C10.7334 9.4533 11.3665 9.4533 11.7571 9.84383L15.9997 14.0865Z"
              fill="#B9B9B7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      editTitle: this.title,

    };
  },
  props: ['title', 'depth', 'index', 'noDelete'],
  emits: ['handleDelete', 'handleEdit','focus', 'dragStart', 'drop'],

  computed: {
    isDeleteAvailable(){
      return [false,true,true]
    },
    bandColor(){
      return ['bg-[#5743d0]', 'bg-[#fb50ff]', 'bg-[#72a8f9]']
    },
    isMobile() {
      return window.innerWidth < 660
    }
  },

  methods: {
    startEditing() {
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    finishEditing() {
      this.isEditing = false;
      this.$emit('handleEdit', this.editTitle);
    },
    createChapter(){
      if(this.depth == 0){
        this.$emit('handleCreateSubChapter')
        return
      }
      if(this.depth ==1){
        this.$emit('handleCreateSection')
        return
      }
    },
    onDragStart(event) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', this.index)
      this.$emit('dragStart')
    },
    onDragEnter(event) {
      event.preventDefault()
      this.dragOverShow = true
    },
    onDragOver(event){
      event.preventDefault()
      this.dragOverShow = true
    },
    onDragLeave(event) {
      event.preventDefault()
      this.dragOverShow = false
    },
    onDrop(event) {
      event.preventDefault()
      this.dragOverShow = false
      this.$emit('drop')
    }
  },
}
</script>

<style scoped>
.box {
  display: flex;
  align-items: center;
  position: relative;
}

.box h5 {
  display: inline-block;
}

</style>