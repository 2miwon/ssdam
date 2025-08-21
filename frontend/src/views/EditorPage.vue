<template>
  <div v-if="!isMobile" class="flex">
    <EditorLeft class="fixed w-[273px] h-[96%] no-print"/>
    <EditorCenter class="absolute left-[273px] w-[calc(100%-273px)] overflow-y-auto no-print"/>
    <PrintModal v-if="showPrintModal"/>
    <div v-if="!checkEditorWatched">
      <div v-if="this.editorOnboardingProcess==0"
        class="absolute top-[70px] left-[30px]">
        <OnBoardingMessage :pointerPosition="0" :message="'작가님의 책 제목이에요. 해당 페이지에서 글을 작성하시면, 머리말(서문)이 됩니다!'" @close="handleCloseOnboarding"/>
      </div>
      <div v-if="this.editorOnboardingProcess==1"
        class="absolute bottom-[250px] left-[30px]">
        <OnBoardingMessage :pointerPosition="2" :message="'자유롭게 목차를 추가해 보세요. 생성된 목차를 꾹 누른 상태로 움직이면 페이지를 옮길 수 있어요!'" @close="handleCloseOnboarding"/>
      </div>
      <div v-if="this.editorOnboardingProcess==2"
        class="absolute bottom-[180px] left-[30px]">
        <OnBoardingMessage :pointerPosition="2" :message="'삭제된 페이지는 휴지통에서 확인해 보세요.'" :messageTwo="'복구 또는 영구적으로 삭제할 수 있어요!'" @close="handleCloseOnboarding"/>
      </div>
      <div v-if="this.editorOnboardingProcess==3"
        class="absolute top-[10px] right-[450px]">
        <OnBoardingMessage :pointerPosition="1" :message="'퇴고 버튼을 누르면, 현재 보고 있는 페이지에서 퇴고 과정이 진행됩니다!'" @close="handleCloseOnboarding"/>
      </div>
      <div v-if="this.editorOnboardingProcess==4"
        class="absolute top-[10px] right-[340px]">
        <OnBoardingMessage :pointerPosition="1" :message="'글이 책이 되었을 때의 모습을 미리 확인하실 수 있어요! 아직 개선 중인 서비스입니다. 추후 더 예쁜 화면으로 찾아뵐게요!'" @close="handleLastOnboarding"/>
      </div>
    </div>
  </div>
  <div v-else class="flex">
    <EditorLeft class="h-full no-print"/>
    <EditorCenter v-if="editorLeftFolded" class="left-0 w-full overflow-y-auto no-print"/>
  </div>
</template>

<script>
import EditorLeft from '@/components/Editor/Left/EditorLeft.vue'
import EditorCenter from '@/components/Editor/Center/EditorCenter.vue'
import PrintModal from '@/components/Editor/PrintModal.vue'
import OnBoardingMessage from '@/components/OnBoardingMessage.vue'

  export default {
    components: {
      EditorLeft,
      EditorCenter,
      PrintModal,
      OnBoardingMessage,
    },
    computed: {
      title() {
        return this.$store.getters.currentBook.book_schema.main_chapter.title
      },
      showPrintModal() {
        return this.$store.getters.showPrintModal
      },
      checkEditorWatched() {
        return this.$store.getters.checkEditorWatched
      },
      editorOnboardingProcess() {
        return this.$store.getters.editorOnboardingProcess
      },
      isMobile() {
        return this.screenWidth < 660
      },
      editorLeftFolded() {
        return this.$store.getters.editorLeftFolded;
      },
    },
    watch: {
      title() {
        document.title = `${this.title.length==0 ? '제목없음' : this.title}`
      }
    },
    mounted() {
      document.title = `${this.title.length==0 ? '제목없음' : this.title}`
      this.$store.commit('SET_EDITOR_ONBOARDING_PROCESS', 0)
      window.addEventListener('resize', this.handleResize)
    },
    methods: {
      handleClosePrintModal() {
        this.$store.commit('SET_SHOW_PRINT_MODAL', false)
      },
      handleCloseOnboarding() {
      this.$store.commit('SET_EDITOR_ONBOARDING_PROCESS', this.editorOnboardingProcess+1)
      },
      handleLastOnboarding() {
        this.$store.dispatch('updateUser', 1)
      },
      handleResize() {
        this.screenWidth = window.innerWidth
      }
    },
    data() {
      return {
        screenWidth: window.innerWidth
      }
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize)
    },
  }
</script>

<style>
@media print {
  /* 상단의 페이지 이름, 날짜 등을 숨김 */
  @page {

    margin-top: 0cm;
    margin-bottom: 1cm;
    margin-left: 1.3cm;
    margin-right: 0cm;
  }

  /* 모든 요소의 여백을 초기화 */
  body {
    margin: 0cm;
    padding: 0;
  }

  /* 특정 요소를 인쇄하지 않도록 설정 EditorLeft, EditorCenter, TopBanner */
  .no-print {
    display: none;
  }

  /* URL 등을 숨김 - 효과 없음*/
  /* a:link:after,
  a:visited:after {
    content: "";
  } */

  /* 페이지 헤더와 푸터를 숨김 - 효과 없음 */ 
  /* header, footer {
    display: none;
  } */

  /* fixed 요소를 static으로 변경 */
  .fixed {
    position: static !important;
  }
  
  .scrollable-content {
    overflow: visible;
  }
}
</style>