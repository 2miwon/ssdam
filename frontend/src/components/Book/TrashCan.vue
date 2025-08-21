<template>
  <div class="m-5 w-full pt-5 px-8">
    <div v-if="showTrashCan" class="w-full max-w-[210px] flex-col justify-start items-start gap-2 inline-flex mb-3">
      <div class="text-zinc-900 text-2xl font-bold leading-9">휴지통</div>
    </div>
    <div v-if="showTrashCan" class="rounded-lg w-full h-[calc(100vh-200px)] overflow-hidden">
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full h-full overflow-y-auto">
        <DeletedBookComponent
            v-for="(book, index) in books"
            class="cursor-pointer"
            :key="book.book_id"
            :book="book"
            :index="index"
            :openIndex="openIndex"
            @recoverBook="handleRecoverBook"
            @deleteBook="handleDeleteBook"
            @toggleDropdown="handleToggleDropdown"
            @closeDropdown="handleCloseDropdown"
        />
      </div>
    </div>
    <BookDeletedState
        v-if="showBookDeletedState" :deletedStateMessage="deletedStateMessage"
        :isMobile="isMobile"
        :class="['fixed top-[62px] bg-white p-4 shadow-lg z-50', isMobile ? 'left-1/2 transform -translate-x-1/2' : 'left-1/2']"
    ></BookDeletedState>
  </div>
</template>

<script>
import DeletedBookComponent from "@/components/Book/DeletedBookComponent.vue";
import BookDeletedState from "@/components/Book/modal/BookDeletedState.vue";

export default {
  data(){
    return{
      openIndex: null,
      creatingBook: false,
      showBookDeletedState: false,
      deletedStateMessage: '',
      screenWidth: window.innerWidth,
    }
  },

  computed: {
    books() {
      return this.$store.getters.bookList
    },
    isMobile() {
      return this.screenWidth < 660
    },
    isFolded() {
      return this.$store.getters.bookLeftBarFolded
    },
    showTrashCan(){
      if(!this.isMobile || (this.isMobile && this.isFolded)) {
        return true
      }
      return false
    },
  },
  mounted() {
    this.$store.dispatch('fetchBookList');
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleToggleDropdown(index) {
      this.openIndex = index;
    },
    handleCloseDropdown() {
      this.openIndex = null;
    },
    handleRecoverBook(){
      this.deletedStateMessage = "책이 복원되었습니다."
      this.showBookDeletedState = true
      setTimeout(() => {
        this.showBookDeletedState = false
      }, 2000)
    },
    handleDeleteBook(){
      this.deletedStateMessage = "책이 삭제되었습니다."
      this.showBookDeletedState = true
      setTimeout(() => {
        this.showBookDeletedState = false
      }, 2000)
    },
    handleResize() {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight
    },
  },
  components: {
    DeletedBookComponent,
    BookDeletedState,
  }
};
</script>
