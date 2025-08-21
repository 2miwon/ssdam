<template>
  <div
      :class="['w-[53vw] mx-auto m-10', isMobile ? 'h-[60vh]' : 'h-[45vh]']">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
      <button v-for="(item, index) in buttonList" :key="index"
        @click="handleButtonClick(item.topic)"
        :class="['flex flex-col items-center justify-center w-269 h-103 rounded-lg overflow-hidden shadow border border-zinc-100 hover:bg-[#f2f2f2]',  clickedButton == item.topic ? 'bg-zinc-100' : 'bg-white']">
        <div class="flex items-center">
          <img :src="item.path" alt="icon" class="w-8 h-8">
          <span
              :class="['ml-2 font-semibold', isMobile ? 'text-sm' : 'text-base']">{{ item.topic }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['buttonList'],
    emits: ['buttonClicked'],

  data(){
    return {
      clickedButton: ''
    }
  },

  methods: {
    handleButtonClick(topic) {
      this.clickedButton = topic;
      this.$emit('buttonClicked', topic);
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    },
  }
}
</script>