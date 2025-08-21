<template>
  <div class="flex">
    <div>
      <svg @click="handleBackButton"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-7 h-7 relative rounded"
        preserveAspectRatio="none">
        <path
          d="M4.83574 12.0001L11.0428 5.79297L12.457 7.20718L7.66414 12.0001L12.457 16.793L11.0428 18.2072L4.83574 12.0001ZM10.4856 12.0001L16.6927 5.79297L18.1069 7.20718L13.314 12.0001L18.1069 16.793L16.6927 18.2072L10.4856 12.0001Z"
          fill="#727272">
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    editorLeftFolded() {
      return this.$store.getters.editorLeftFolded;
    },
  },
  methods: {
    handleBackButton() {
      if(this.$route.name=='editor') {
        if(this.$store.getters.editorLeftFolded) {
          this.$store.commit('SET_EDITOR_LEFT_FOLDED', false);
        }
        else {
          this.$router.push({ name: 'book'})
        }    
      }
      if(this.$route.name=='book') {
        if(this.$store.getters.bookLeftBarFolded) {
          this.$store.commit('SET_BOOK_LEFT_BAR_FOLDED', false)
        }
        else {
          this.$router.push({ name: 'login'})
        }
      }
    }
  }
}
</script>