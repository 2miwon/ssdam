<template>
  <div v-if = "book.is_deleted === false || book.is_deleted === null"
       class="book-component w-full h-auto flex-col justify-start items-start gap-3 inline-flex pb-[25px]">
    <div @click="moveToBook" class="w-full h-[80%] relative bg-white rounded-tr-2xl rounded-br-2xl shadow border border-zinc-100 cursor-pointer">
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
          <span v-if="!isEditing" @dblclick.stop="startEditing">
            {{ title.length==0 ? '제목없음' : title }}
          </span>
          <input
              ref="titleInput"
              v-else
              v-model="editedTitle"
              @keypress.enter.prevent="finishEditing"
              @blur.stop="finishEditing"
              class="w-auto h-auto border-b border-gray-300 focus:outline-none focus:border-blue-500"
          >
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
            <div @click.stop="changeTitle" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">제목 바꾸기</div>
            <div ref="subMenu" class="relative group">
              <div @click.stop class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">표지 바꾸기</div>
              <div :class="['absolute top-0 ml-[2px] mt-0 w-40 bg-white rounded-md shadow-lg z-50 hidden group-hover:block', this.modifyCoverImageToggleLocation]">
                <div class="py-1">
                  <div @click.stop="uploadImage" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">이미지 업로드</div>
                  <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                      accept="image/*"
                      style="display: none;"
                  >
                  <div @click.stop="changeCover" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">랜덤 변경</div>
                </div>
              </div>
            </div>
            <div @click.stop="handleShowDeleteModal" class="block px-4 py-2 text-sm text-[#ff4747] hover:bg-gray-100">삭제하기</div>
            <div @click.stop="updateBookState" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ bookStateSwitch }}</div>
          </div>
        </div>
      </div>
    </div>
    <DeleteConfirmationModal v-if="showDeleteModal" :mainMessage="'이 책을 정말로 삭제하시겠습니까?'" :subMessage="'책을 휴지통으로 이동합니다. 나중에 복구할 수 있습니다.'" @deleteBook="deleteBook" @closeModal="handleCloseDeleteModal"/>

    <ImagePreviewModal
        :show="showPreviewModal"
        :imageUrl="imagePreview"
        @close="closePreviewModal"
        @confirm="confirmUpload"
    />
  </div>
  <ErrorModal v-if="showErrorMessage" :message="this.errorMessage" class="fixed top-[62px] left-[44%] bg-white p-4 shadow-lg z-50"></ErrorModal>
</template>


<script>

import ImagePreviewModal from "@/components/Book/modal/ImagePreviewModal.vue";
import ErrorModal from "@/components/Book/modal/ErrorModal.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
export default {
  components: {
    ErrorModal,
    DeleteConfirmationModal,
    ImagePreviewModal
  },

  props: ['book', 'index', 'openIndex'],
  emits: ['deleteBook', 'moveToBook', 'toggleDropdown', 'closeDropdown'],
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
      isEditing: false,
      editedTitle: '',
      showDeleteModal: false,
      modifyCoverImageToggleLocation: 'left-full',
      imagePreview: null,
      showPreviewModal: false,
      selectedFile: null,
      showErrorMessage: false,
      errorMessage: ''
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
    moveToBook(){
      this.$emit('moveToBook', this.index)
    },
    toggleDropdown(){
      if(this.isDropdownOpen){
        this.closeDropdown();
      }else{
        this.openDropdown();
      }
      this.$nextTick(() => {
        const subMenu = this.$refs.subMenu;
        if (subMenu) {
          const rect = subMenu.getBoundingClientRect();
          if (rect.right + 100 > window.innerWidth) {
            this.modifyCoverImageToggleLocation = 'right-full'
          } else {
            this.modifyCoverImageToggleLocation = 'left-full'
          }
        }
      });
    },
    openDropdown() {
      this.isDropdownOpen = true;
      this.$emit('toggleDropdown', this.index);
    },
    closeDropdown() {
      this.isDropdownOpen = false;
      this.$emit('closeDropdown');
    },
    changeTitle() {
      this.startEditing()
      this.isDropdownOpen = false;
    },
    changeCover() {
      this.$store.dispatch('modifyCoverImage', {index:this.index})
      this.isDropdownOpen = false;
    },
    uploadImage() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      // const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const file = event.target.files[0];
      if (file) {
        if(!this.validateFile(file))
          return;
        this.selectedFile = file;
        this.createImagePreview(file);
        this.showPreviewModal = true;
      }
    },
    validateFile(file){
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = "JPG, PNG, JPEG 형식의 이미지만 업로드 가능합니다."
        this.showErrorMessage = true
        this.closePreviewModal();
        setTimeout(() => {
          this.showErrorMessage = false
        }, 2000)
        return false;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errorMessage = "이미지 크기가 허용된 범위를 벗어났습니다"
        this.showErrorMessage = true
        this.closePreviewModal();
        setTimeout(() => {
          this.showErrorMessage = false
        }, 2000)
        return false;
      }
      return true;
    },
    createImagePreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    closePreviewModal() {
      this.showPreviewModal = false;
      this.imagePreview = null;
      this.selectedFile = null;
    },
    async confirmUpload() {
      if (this.selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          await this.$store.dispatch('uploadBookCoverImage',  { bookIdx: this.index, formData: formData });
          this.closePreviewModal();
          window.location.reload();
        } catch (error) {
          this.errorMessage = "예상치 못한 에러가 발생했습니다. 다시 시도해 주세요."
          this.showErrorMessage = true
          setTimeout(() => {
            this.showErrorMessage = false
          }, 2000)
          this.closePreviewModal();
        }
      }
    },
    handleShowDeleteModal() {
      this.showDeleteModal = true;
    },
    handleCloseDeleteModal() {
      this.showDeleteModal = false;
      this.closeDropdown()
    },
    deleteBook() {
      const now = new Date();
      const deletedAt = now.toISOString().slice(0, -1);
      this.$store.dispatch("updateBookDeletedState", { bookIdx: this.index, isDeleted: true, deletedAt: deletedAt})
      this.closeDropdown()
      this.$emit('deleteBook');
    },

    startEditing(){
      this.isEditing= true
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      });
      this.editedTitle = this.title
    },

    finishEditing() {
      this.isEditing = false
      this.title = this.editedTitle
      this.$store.dispatch('updateBookMainTitle',{index:this.index,editedTitle: this.editedTitle})
    },

    async updateBookState() {
      if (this.book.is_finished === true) {
        await this.$store.dispatch('updateBookFinishedState', {bookIdx: this.index, isFinished: false})
      } else {
        await this.$store.dispatch('updateBookFinishedState', {bookIdx: this.index, isFinished: true})
      }
      this.closeDropdown()
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
