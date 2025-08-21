<template>
  <div :class="['m-5 pt-5 px-8',widthBookShelf]">
    <div v-if="showBookShelf"
          :class="['w-full max-w-[210px] flex-col justify-start items-start gap-2 inline-flex mb-3']">
      <div class="text-zinc-900 text-2xl font-bold leading-9">작가의 서재</div>
      <div class="justify-start items-start inline-flex">
        <div class="text-zinc-900 text-base font-bold leading-normal">{{bookCnt}}</div>
        <div class="text-neutral-400 text-base font-medium leading-normal">개의 책이 저장되어 있습니다</div>
      </div>
    </div>
    <div v-if="showBookShelf" class="rounded-lg w-full h-[80vh] overflow-y-auto">
      <div :class="['grid content-start grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full h-full overflow-y-auto']">
        <CreateNewBookComponent
            :class="[!creatingBook ? 'cursor-pointer' : 'cursor-wait']"
            class="cursor-pointer"
            @click="handleCreateNewBook"
        />
          <BookComponent
            v-for="(book, index) in books"
            :key="book.book_id"
            :book="book"
            :index="index"
            :openIndex="openIndex"
            @deleteBook="handleDeleteBook"
            @moveToBook="handleMoveToBook(index)"
            @toggleDropdown="handleToggleDropdown"
            @closeDropdown="handleCloseDropdown"/>
          <div class="h-[200px]"></div>
      </div>
    </div>
    <BookDeletedState
        v-if="showBookDeletedState"
        :deletedStateMessage="deletedStateMessage"
        :isMobile="isMobile"
        :class="['fixed top-[62px] bg-white p-4 shadow-lg z-50', isMobile ? 'left-1/2 transform -translate-x-1/2' : 'left-1/2']"
    ></BookDeletedState>
  </div>
</template>

<script>
import BookComponent from '@/components/Book/BookComponent.vue'
import CreateNewBookComponent from "@/components/Book/CreateNewBookComponent.vue";
import BookDeletedState from "@/components/Book/modal/BookDeletedState.vue";

export default {
  data(){
    return{
      openIndex: null,
      creatingBook: false,
      showBookDeletedState: false,
      deletedStateMessage: '',
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    }
  },

  computed: {
    books() {
      return this.$store.getters.bookList
    },
    bookCnt(){
      return this.$store.getters.bookList.filter(book =>
          book.is_deleted === false || book.is_deleted === null
      ).length;
    },
    widthBookShelf() {
      if(this.isMobile && this.isFolded){
        return 'w-[90vw]'
      }
      if(this.isMobile && !this.isFolded){ //펼쳐져있음
        return 'w-[10vw]'
      }
      return 'w-full'
    },
    isMobile() {
      return this.screenWidth < 660
    },
    isFolded() {
      return this.$store.getters.bookLeftBarFolded
    },
    showBookShelf(){
      if(!this.isMobile || (this.isMobile && this.isFolded) ) {
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
    handleMoveToBook(index) {
      if(this.$store.getters.currentBook && this.$store.getters.currentBook.book_id !== this.$store.getters.bookList.at(index).book_id) {
        this.$store.commit('CLEAR_IMAGE_KEY_VALUE')
      }
      this.$store.commit('SET_CURRENT_BOOK', this.$store.getters.bookList.at(index));
      this.$router.push({name: 'editor'});
    },
    async handleCreateNewBook() {
      if(this.creatingBook) return
      this.creatingBook = true
      await this.$store.dispatch('createNewBook');
      this.$store.commit('RESET_RECOMMEND_PROCESS')
      setTimeout(() => {
        this.creatingBook = false
      }, 2000);
      this.$router.push({name: 'recommend'});
    },
    handleToggleDropdown(index) {
      this.openIndex = index;
    },
    handleCloseDropdown() {
      this.openIndex = null;
    },
    handleDeleteBook() {
      this.deletedStateMessage = "책을 휴지통으로 이동했습니다."
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
    BookDeletedState,
    CreateNewBookComponent,
    BookComponent,
  }
};
</script>
