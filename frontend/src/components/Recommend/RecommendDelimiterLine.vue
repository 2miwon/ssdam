<template>
  <div class="ml-3 relative" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <div v-if="visibleLine" class="mt-3">
      <svg
          width="241"
          height="1"
          viewBox="0 0 241 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mt-1 flex-grow-0 flex-shrink-0"
          preserveAspectRatio="xMidYMid meet">
        <line y1="0.5" x2="241" y2="0.5" stroke="#F2F2F2"></line>
      </svg>
    </div>
    <div class="h-8 absolute inset-0 -top-4 -bottom-4" :class="{ 'bg-sky-400 opacity-50': dragOverShow }" style="z-index: 10;"></div>
  </div>
</template>

<script>
export default {
  props: ['visibleLine'],
  emits: ['drop'],
  data() {
    return {
      dragOverShow: false
    }
  },
  methods: {
    onDragEnter(event) {
      event.preventDefault()
      this.dragOverShow = true
    },
    onDragOver(event) {
      event.preventDefault()
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