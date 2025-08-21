<template>
  <div class="w-full" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
    :class="{ 'bg-sky-400':dragOverShow }">
    <div v-if="visibleLine" class="mt-3">
      <hr class="h-[0px] border-t-[1px] border-[#F2F2F2]">
    </div>
    <div class="h-2"></div>
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
    computed: {
      newX2() {
        return this.$el.clientWidth * 0.9
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