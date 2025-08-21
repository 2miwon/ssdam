<template>
  <div ref="scrolledPosition">
    <div v-if="!isMobile" ref="modalContainer" class="fixed left-[255px] w-[373px] h-[506px] overflow-y-auto rounded-[10px] bg-white z-30 flex flex-col" style="box-shadow: 0px 4px 12.899999618530273px 0 rgba(0,0,0,0.1);" @click.stop>
      <div class="flex-grow">
        <div v-for="page in deletedPages" :key="page.page_id">
          <PageTrashBox :page="page.page" @restore="handleRestore(page)" @delete="handleDelete(page)"/>
        </div>
      </div>
      <div class="flex w-[373px] h-[55px] bg-[#F9F4FF] justify-center items-center flex-shrink-0">
        <p class="text-center text-sm text-[#5743d0]">
          휴지통에 30일 이상 보관된 페이지는 자동으로 삭제됩니다.
        </p>
      </div>
    </div>
    
    <div v-else ref="modalContainer" class="fixed w-full h-[506px] overflow-y-auto rounded-[10px] bg-white z-30 flex flex-col" style="box-shadow: 0px 4px 12.899999618530273px 0 rgba(0,0,0,0.1);" @click.stop>
      <div class="flex-grow">
        <div v-for="page in deletedPages" :key="page.page_id">
          <PageTrashBox :page="page.page" @restore="handleRestore(page)" @delete="handleDelete(page)"/>
        </div>
      </div>
      <div class="flex w-full h-[55px] bg-[#F9F4FF] justify-center items-center flex-shrink-0">
        <p class="text-center text-sm text-[#5743d0]">
          휴지통에 30일 이상 보관된 페이지는 자동으로 삭제됩니다.
        </p>
      </div>
    </div>

    <div class="fixed top-0 left-0 w-full h-full flex z-20 bg-black bg-opacity-50" @click="handleCloseModal"></div>
    <DeleteConfirmationModal v-if="showDeleteModal" :mainMessage="'이 페이지를 영구적으로 삭제하시겠습니까?'" :subMessage="'삭제 후에는 복구할 수 없습니다.'" @deleteBook="deleteBook" @closeModal="handleCloseDeleteModal"/>
  </div>

</template>

<script>
import PageTrashBox from '@/components/Editor/Left/PageTrashBox.vue'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue';

export default {
  data() {
    return {
      showDeleteModal: false,
      deletePage: null
    }
  },
  components: {
    PageTrashBox,
    DeleteConfirmationModal
  },
  emits: ['closeModal'],
  mounted() {
    this.updatePosition();
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    },
    mainChapter() {
      return this.$store.getters.currentBook.book_schema.main_chapter
    },
    deletedPages() {
      const ret = []
      for (let i = 0; i < this.mainChapter.sub_chapter_list.length; i++) {
        const subChapter = this.mainChapter.sub_chapter_list[i]
        if (subChapter.is_deleted) {
          ret.push({ page: subChapter, index1: i, index2: -1 })
        }
        for (let j = 0; j < subChapter.section_list.length; j++) {
          const section = subChapter.section_list[j]
          if (section.is_deleted) {
            ret.push({ page: section, index1: i, index2: j })
          }
        }
      }
      ret.sort((a, b) => {
        return new Date(b.page.deleted_at) - new Date(a.page.deleted_at)
      })
      return ret
    },
  },
  methods: {
    handleCloseModal() {
      this.$emit('closeModal');
    },
    updatePosition() {
      const container = this.$refs.modalContainer;
      const scrolledPosition = this.$refs.scrolledPosition.getBoundingClientRect().top
      container.style.top = `${scrolledPosition - 540}px`; // Adjust the offset as needed
    },
    handleRestore(page) {
      this.$store.dispatch('restoreSubTreeInBookSchema', { 
        index1: page.index1,
        index2: page.index2 
      })
      this.$store.dispatch('updateBook')
    },
    handleDelete(page) {
      this.deletePage = page
      this.showDeleteModal = true
    },
    deleteBook() {
      this.$store.dispatch('permanentDeleteSubTreeInBookSchema', { 
        index1: this.deletePage.index1,
        index2: this.deletePage.index2 
      })
      this.$store.dispatch('updateBook')
      this.showDeleteModal = false
    },
    handleCloseDeleteModal() {
      this.showDeleteModal = false
    }
  },

};
</script>