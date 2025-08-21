<template>
  <div ref="scrolledPosition">
    <div ref="modalContainer" class="fixed w-[120px] rounded-2xl bg-white border border-[#f2f2f2] shadow-modal z-30"
      :class="{ 'h-[100px]':depth==0, 'h-[180px]':depth==1, 'h-[140px]':depth==2, 'right-[30px]':isMobile,'left-[210px]':!isMobile  }" @click.stop>
      <div class="flex flex-col justify-start items-start w-[120px] absolute left-0 top-[10px]">
        <div class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[40px] relative px-5 py-2.5 rounded hover:bg-gray-200 cursor-pointer"
          @click="handleChangeTitle">
          <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#474747]">
            제목 바꾸기
          </p>
        </div>
        <div class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[40px] relative px-5 py-2.5 rounded hover:bg-gray-200 cursor-pointer"
          @click="handleDraftRecommend">
          <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#474747]">
            초안 작성
          </p>
        </div>
        <div v-if="depth==1" class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[40px] relative px-5 py-2.5 rounded hover:bg-gray-200 cursor-pointer"
          @click="handleAddSection">
          <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#474747]">
            소목차 추가
          </p>
        </div>
        <div v-if="depth!=0" class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[40px] relative px-5 py-2.5 rounded hover:bg-gray-200 cursor-pointer"
          @click="handleDelete">
          <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#ff4747]">
            삭제하기
          </p>
        </div>
      </div>
    </div>
    <div class="fixed top-0 left-0 w-full h-full flex z-20" @click="handleCloseModal"></div>
  </div>
  <div>
    <DraftRecommendModal v-if="showDraftRecommendModal" @closeModal="showDraftRecommendModal=false" @draftRecommend="doDraftRecommend"/>
  </div>
</template>

<script>
import DraftRecommendModal from '@/components/Editor/DraftRecommendModal.vue';

export default {
  components: {
    DraftRecommendModal
  },
  data() {
    return {
      showDraftRecommendModal: false
    }
  },
  props: ['depth'],
  emits: ['closeModal', 'changeTitle', 'delete', 'addSection', 'draftRecommend'],
  mounted() {
    this.updatePosition();
    window.addEventListener('scroll', this.updatePosition, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.updatePosition);
  },
  methods: {
    handleCloseModal() {
      this.$emit('closeModal');
    },
    handleChangeTitle() {
      this.$emit('changeTitle');
    },
    handleDelete() {
      this.$emit('delete');
    },
    updatePosition() {
      const container = this.$refs.modalContainer;
      const scrolledPosition = this.$refs.scrolledPosition.getBoundingClientRect().top
      container.style.top = `${scrolledPosition - 10}px`; // Adjust the offset as needed
    },
    handleAddSection() {
      this.$emit('addSection');
    },
    handleDraftRecommend() {
      if(this.$store.getters.bookTopic == '' || this.$store.getters.bookPurpose == '' || this.$store.getters.bookStyle == '') {
        this.showDraftRecommendModal = true;
        return;
      }
      this.$emit('draftRecommend');
    },
    doDraftRecommend() {
      this.showDraftRecommendModal = false;
      this.$emit('draftRecommend');
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660;
    }
  }
};
</script>