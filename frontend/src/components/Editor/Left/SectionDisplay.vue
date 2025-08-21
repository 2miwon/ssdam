<template>
  <div @click="handleClick" class="w-[100%]"
    :class="{ 'bg-[#f9f4ff]':currentFocus&&!isMobile }"
    :style="{ 'pointer-events': this.$route.name == 'revision' || this.$store.getters.draftRecommendation ? 'none' : 'auto' }"
    :draggable="!noDrag" @dragstart="onDragStart" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <div class="flex justify-start items-center h-[45px] pl-2 pr-1 py-2.5 rounded hover:bg-[#f2f2f2] cursor-pointer relative group"
      :class="{ 'bg-[#f2f2f2]':menuToggle, 'bg-sky-100':dragOverShow&&!this.noDrop }" >
      <div v-if="changingTitle" class="flex-grow">
        <input class="w-full h-[30px] text-[15px] font-bold text-left text-[#1b1b1b] placeholder-gray-500 bg-transparent outline-none border-b focus:border-blue-500"
          ref="titleInput" placeholder="제목없음" v-model="newTitle" @blur="handleEmitTitle" @keypress.enter="$event.target.blur()" autofocus>
      </div>
      <div v-else :class="{ 'text-[#b3b7bc] font-semibold':((this.$route.name == 'revision' || this.$store.getters.draftRecommendation) && !currentFocus) }"
        class="flex-grow truncate">
        <p v-if="depth==0" class="text-[15px] font-bold text-left truncate">
          {{ titleDisplay }}
        </p>
        <p v-else-if="depth==1" class="text-[15px] font-bold text-left truncate">
          {{ index + ". " + titleDisplay }}
        </p>
        <p v-else class="ml-4 text-sm font-medium text-left truncate">
          {{ titleDisplay }}
        </p>
      </div>
      <div class="opacity-0 group-hover:opacity-100 flex justify-end items-center flex-grow-0 flex-shrink-0 relative gap-2"
        :class="{ 'opacity-100':menuToggle||isMobile }">
        <div @click.stop="handleMenuClick" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded-lg hover:bg-white"
          :class="{'bg-white':!isMobile && menuToggle, 'bg-gray-100':!isMobile && !menuToggle}">
          <div class="flex justify-start items-start absolute left-[5px] top-2.5 gap-0.5">
            <div v-for="i in 3" :key="i">
              <svg
                width="3"
                height="3"
                viewBox="0 0 3 3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="flex-grow-0 flex-shrink-0"
                preserveAspectRatio="xMidYMid meet">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#B9B9B7"></circle>
              </svg>
            </div>
          </div>
        </div>
        <div v-if="!isMobile" class="flex-grow-0 flex-shrink-0 w-4 h-6 relative rounded-[3px]">
          <div class="justify-end grid grid-cols-2 grid-rows-3 gap-0.5 absolute left-1 top-1">
            <div v-for="i in 6" :key="i">
              <svg
                width="3"
                height="3"
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
    </div>
    <div v-if="menuToggle" @click.stop>
      <ModifyModal @closeModal="handleCloseModal" @changeTitle="handleChangeTitle" @addSection="handleAddSection" @delete="handleDelete" @draftRecommend="handleDraftRecommend" :depth="depth"/>
    </div>
  </div>
</template>

<script>
import ModifyModal from '@/components/Editor/Left/ModifyModal.vue'

  export default {
    components: {
      ModifyModal
    },
    props: ['title', 'depth', 'index', 'currentFocus', 'noDrag', 'noDrop'],
    emits: ['focus', 'changeTitle', 'delete', 'dragStart', 'drop', 'addSection', 'draftRecommend'],
    data: function() {
      return {
        maxTitleLength: 13,
        menuToggle: false,
        changingTitle: false,
        newTitle: this.title,
        dragOverShow: false,
      }
    },
    computed: {
      titleDisplay() {
        if (this.title.length == 0)
          return '제목없음'
        return this.title
      },
      isMobile() {
        return window.innerWidth < 660
      }
    },
    methods: {
      handleAddSection() {
        this.$emit('addSection')
      },
      handleClick() {
        this.$emit('focus')
      },
      handleMenuClick() {
        this.menuToggle = true
      },
      handleCloseModal() {
        this.menuToggle = false
      },
      handleChangeTitle() {
        this.menuToggle = false
        this.changingTitle = true
        this.newTitle = this.title
        this.$nextTick(() => {
          this.$refs.titleInput.focus()
        })
      },
      handleDelete() {
        this.menuToggle = false
        this.$emit('delete')
      },
      handleEmitTitle() {
        this.changingTitle = false
        this.$emit('changeTitle', this.newTitle)
      },
      handleDraftRecommend() {
        this.menuToggle = false
        this.$emit('draftRecommend')
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
    }
  }
</script>

