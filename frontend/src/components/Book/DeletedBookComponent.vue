<template>
  <div v-if="book.is_deleted === true" class="book-component w-full h-auto flex-col justify-start items-start gap-3 inline-flex pb-[25px]">
    <div class="w-full h-[80%] relative bg-white rounded-tr-2xl rounded-br-2xl shadow border border-zinc-100">
      <img ref="image" class="w-full h-full object-cover absolute left-0 top-0 rounded-tr-2xl rounded-br-2xl"
           :src="coverImageUrl" />
      <div class="w-[10%] h-full left-0 top-0 absolute bg-yellow-50"></div>
      <div :class="['px-2.5 py-[3px] right-4 top-4 absolute rounded-[41px] border border-orange-400/opacity-30 flex-col justify-center items-center gap-2.5 inline-flex', this.book.is_finished ? 'bg-orange-100' : 'bg-[#d0ffdd]']">
        <div :class="['text-xs font-medium leading-[18px]', this.book.is_finished ? 'text-[#ff7b1b]' : 'text-[#1ebc4a]']">{{ bookState }}</div>
      </div>
    </div>
    <div class="w-full flex justify-between items-start">
      <div class="flex-col justify-start items-start gap-1 inline-flex overflow-hidden">
        <div class="text-stone-900 text-base font-bold leading-normal w-full truncate" >
          <span>
            {{ title.length==0 ? '제목없음' : title }}
          </span>
        </div>
        <div class="text-neutral-400 text-xs font-medium leading-[18px]">
          {{formattedDate}}
        </div>
      </div>
      <div class="relative">
        <button @click.stop="toggleDropdown" class="w-[35px] h-[35px] bg-white rounded-lg border border-zinc-100 flex-shrink-0 flex items-center justify-center hover:bg-[#f2f2f2]">
          <div class="flex gap-0.5">
            <div class="w-[3px] h-[3px] bg-neutral-700 rounded-full"></div>
            <div class="w-[3px] h-[3px] bg-neutral-700 rounded-full"></div>
            <div class="w-[3px] h-[3px] bg-neutral-700 rounded-full"></div>
          </div>
        </button>
        <div v-if="isDropdownOpen" class="absolute right-[-8px] top-full mt-2 w-40 bg-white rounded-md shadow-lg z-50 transform translate-x-1/4">
          <div class="py-1">
            <div @click.stop="handleRecoverBook" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">복원하기</div>
            <div @click.stop="handleShowDeleteModal" class="block px-4 py-2 text-sm text-[#ff4747] hover:bg-gray-100">영구삭제</div>
          </div>
        </div>
      </div>
    </div>
    <DeleteConfirmationModal v-if="showDeleteModal" :mainMessage="'이 책을 영구적으로 삭제하시겠습니까?'" :subMessage="'삭제 후에는 복구할 수 없습니다.'" @deleteBook="deleteBook" @closeModal="handleCloseDeleteModal"/>
  </div>
</template>


<script>

import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

export default {
  components: {
    DeleteConfirmationModal
  },

  props: ['book', 'index', 'openIndex'],
  mounted() {
    document.addEventListener('click', this.closeDropdown);
    document.addEventListener('keydown', this.closeDropdown)

  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
    document.removeEventListener('keydown', this.closeDropdown)

  },

  data(){
    return {
      title: this.book.book_schema.main_chapter.title || '제목 없음',
      isDropdownOpen: false,
      showDeleteModal: false
    }
  },

  watch: {
    openIndex(idx){
      if(idx != this.index){
        this.isDropdownOpen = false;
      }
    }
  },

  computed: {
    formattedDate() {
      return this.book.created_at.slice(0, 10);
    },
    coverImageUrl() {
      return this.book.cover_image_url || process.env.VUE_APP_DEFAULT_COVER_IMAGE;
    },
    bookState() {
      return this.book.is_finished === true ? "집필완료" : "집필중";
    },
    bookStateSwitch(){
      return this.book.is_finished === true ? "집필중" : "집필완료";
    }
  },

  methods: {
    toggleDropdown(){
      if(this.isDropdownOpen){
        this.closeDropdown();
      }else{
        this.openDropdown();
      }
    },
    openDropdown() {
      this.isDropdownOpen = true;
      this.$emit('toggleDropdown', this.index);
    },
    closeDropdown() {
      this.isDropdownOpen = false;
      this.$emit('closeDropdown');
    },

    handleShowDeleteModal() {
      this.showDeleteModal = true;
    },
    handleCloseDeleteModal() {
      this.showDeleteModal = false;
      this.closeDropdown()
    },
    handleRecoverBook() {
      this.$store.dispatch('updateBookDeletedState', { bookIdx: this.index, isDeleted: false, deletedAt: null })
      this.closeDropdown()
      this.$emit('recoverBook')
    },
    deleteBook() {
      this.$store.dispatch("deleteBook", {bookId: this.book.book_id, index: this.index})
      this.closeDropdown()
      this.$emit('deleteBook')
    },
  }
}
</script>

<style scoped>
.book-component {
  aspect-ratio: 262 / 409;
  max-width: 262px;
  max-height: 409px;
}
</style>
