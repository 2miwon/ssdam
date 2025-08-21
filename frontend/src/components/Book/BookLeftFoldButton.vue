<template>
  <div @click="handleBookLeftBarFold">
    <div class="rounded">
      <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 relative"
          preserveAspectRatio="none">
        <path v-if="bookLeftBarFolded"
              d="M19.1643 12.0001L12.9572 5.79297L11.543 7.20718L16.3359 12.0001L11.543 16.793L12.9572 18.2072L19.1643 12.0001ZM13.5144 12.0001L7.30728 5.79297L5.89307 7.20718L10.686 12.0001L5.89307 16.793L7.30728 18.2072L13.5144 12.0001Z"
              fill="#727272">
        </path>
        <path v-else
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
    bookLeftBarFolded() {
      return this.$store.getters.bookLeftBarFolded;
    },
  },
  methods: {
    handleBookLeftBarFold(){
      this.$store.commit('TOGGLE_BOOK_LEFT_BAR_FOLDED')
    }
  }
}
</script>