<template>
  <div class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-[70px] relative pl-10 pr-[60px] py-6 rounded-[14px] border border-[#f2f2f2] cursor-pointer hover:bg-[#f7f8fb]"
    :style="{ 'pointer-events': this.$route.name == 'revision' ? 'none' : 'auto', 'bg-white':!changingTitle, 'bg-[#f7f8fb]':changingTitle }" @click="handleToggleClick">

    <div class="mr-50 w-[90%]">
      <div v-if="changingTitle" class="justify-start" @click.stop>
        <input class="flex-grow-0 flex-shrink-0 w-full text-xl font-bold text-left text-[#1b1b1b] outline-none bg-[#f7f8fb] border-b focus:border-blue-500"
          ref="titleInput" placeholder="제목없음" v-model="newTitle" @blur="handleEmitTitle" @keypress.enter="$event.target.blur()">
      </div>
      <div v-else @dblclick="handleChangeTitle" @click.stop class="justify-start">
        <p class="text-xl font-bold text-left text-[#1b1b1b] cursor-text truncate">
        {{ heading + titleDisplay }}
        </p>
      </div>
    </div>
    <div v-if="this.$route.name=='editor'">
      <svg v-if="toggleOn"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
        preserveAspectRatio="none">
        <path
          d="M11.1953 16.5937C11.595 17.1354 12.405 17.1354 12.8047 16.5937L19.4846 7.53899C19.9716 6.8788 19.5003 5.94534 18.6799 5.94534H5.32016C4.49975 5.94534 4.0284 6.8788 4.51544 7.53899L11.1953 16.5937Z"
          fill="#5B5B5B">
        </path>
      </svg>
      <svg v-else
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
        preserveAspectRatio="none">
        <path
          d="M11.1953 6.40634C11.595 5.86455 12.405 5.86455 12.8047 6.40634L19.4846 15.461C19.9716 16.1212 19.5003 17.0547 18.6799 17.0547H5.32016C4.49975 17.0547 4.0284 16.1212 4.51544 15.461L11.1953 6.40634Z"
          fill="#5B5B5B">
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        changingTitle: false,
        newTitle: this.title,
      }
    },
    props: ['title', 'heading', 'toggleOn'],
    emits: ['toggleClick', 'changeTitle'],
    methods: {
      handleToggleClick() {
        this.$emit('toggleClick')
      },
      handleChangeTitle() {
        this.changingTitle = true
        this.newTitle = this.title
        this.$nextTick(() => {
          this.$refs.titleInput.focus()
        })
      },
      handleEmitTitle() {
        this.changingTitle = false
        this.$emit('changeTitle', this.newTitle)
      }
    },
    computed: {
      titleDisplay() {
        return (this.title.length==0 ? '제목없음' : this.title)
      },
    },
  }
</script>