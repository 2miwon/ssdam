<template>
  <div v-if="!isMobile||this.$store.getters.mobileBlockingMessageChecked" class="flex mb-5 bg-white">
    <BookLeftBar/>
    <BookShelf v-if="this.bookLeftBarStatus === BookLeftBarStatus.BOOKSHELF"/>
    <TrashCan v-if="this.bookLeftBarStatus === BookLeftBarStatus.TRASHCAN"/>
    <!-- <BookEventModal v-if="showBookEvent" @exitEvent="handleExitEvent"></BookEventModal> -->
    <!-- <TermsAndConditions/> -->
  </div>
  <div v-else class="flex justify-center items-center">
    <MobileBlockingMessage/>
  </div>
</template>

<script>
import BookLeftBar from "@/components/Book/BookLeftBar.vue";
import BookShelf from '@/components/Book/BookShelf.vue'
import MobileBlockingMessage from '@/components/MobileBlockingMessage.vue';
import TrashCan from "@/components/Book/TrashCan.vue";
// import BookEventModal from "@/components/BookEvent/BookEventModal.vue";
import { BookLeftBarStatus } from "@/store/constants/bookLeftBarStatus";


  export default {
    data() {
      return {
        screenWidth: window.innerWidth,
        BookLeftBarStatus,
        // tempPosterHidden: false,
      }
    },
    mounted() {
      window.addEventListener('resize', this.handleResize)
      // this.tempPosterHidden = false
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize)
    },
    computed: {
      isMobile() {
        return this.screenWidth < 660
      },
      bookLeftBarStatus() {
        return this.$store.getters.bookLeftBarStatus
      },
      // showBookEvent() {
      //   return this.$store.getters.showPoster && !this.tempPosterHidden;
      // }
    },
    components: {
      BookLeftBar,
      BookShelf,
      MobileBlockingMessage,
      TrashCan,
      // BookEventModal,
    },
    methods: {
      handleResize() {
        this.screenWidth = window.innerWidth
      },
      // handleExitEvent(noShowForToday) {
      //   if (noShowForToday) {
      //     this.$store.commit('SET_NO_POSTER_DATE')
      //   }
      //   this.tempPosterHidden = true
      // },
    },
  }
</script>