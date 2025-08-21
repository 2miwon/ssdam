<template>
  <div class="px-4 sm:px-8 py-[9px] bg-white border-b border-zinc-100 flex justify-between items-center">
    <div class="flex-shrink-0 p-1 flex items-center gap-3">
      <BackButton v-if="isMobile&&(this.$route.name=='editor'||(this.$route.name=='book'&&this.$store.getters.bookLeftBarFolded))"/>
      <SsdamLogo @click="handleTitleClick"/>
      <div v-if="this.$route.name == 'book' || this.$route.name == 'recommend' || this.$route.name == 'editor' || this.$route.name == 'revision'">
        <div class="flex justify-start items-center relative">
          <div class="flex justify-center items-center w-[64px] h-[37px] relative gap-1.5 rounded-lg hover:bg-[#f2f2f2]">
            <p class="flex-grow-0 flex-shrink-0 text-[13px] font-bold text-left text-[#1b1b1b] cursor-pointer"
              @click="handleBookShelfClick">
              나의 책장
            </p>
          </div>
          <svg v-if="this.$route.name=='editor' || this.$route.name=='revision'"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
              preserveAspectRatio="none">
            <path
                d="M8.78032 8.00047L5.95188 5.17203C5.69153 4.91168 5.69153 4.48956 5.95188 4.22921C6.21223 3.96887 6.63434 3.96887 6.89468 4.22922L9.95881 7.29336C10.3493 7.68388 10.3493 8.31705 9.95881 8.70757L6.89468 11.7717C6.63433 12.032 6.21223 12.032 5.95188 11.7717C5.69153 11.5113 5.69153 11.0892 5.95188 10.8289L8.78032 8.00047Z"
                fill="#CDCDCD">
            </path>
          </svg>
          <div v-if="this.$route.name=='editor' || this.$route.name=='revision'"
              :class="['flex justify-center items-center w-[77px] h-[37px] relative gap-1.5 rounded-lg hover:bg-[#f2f2f2]', !creatingBook ? 'cursor-pointer' : 'cursor-wait']">
            <p
              class="w-[80%] text-[13px] font-medium text-left text-[#474747] truncate gap-1.5"
              @click="handleEditorClick">
              {{ this.showMainChapterTitle }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.screenWidthOverLarge" class="absolute left-1/2 transform -translate-x-1/2">
      <ProgressBar @clickEditor="handleEditorClick"/>
    </div>
    <div class="flex flex-row gap-3">
      <CustomerServiceButton class="" v-if="this.$route.name=='home'" @click="handleCustomerServiceClick"/>
      <div class="flex gap-5 justify-center items-center">
        <UndoRedoButton v-if="this.$route.name == 'editor' && !this.showPrintModal && this.screenWidthOverMaximum"/>
        <div class="flex justify-start items-center relative gap-2.5">
          <NextStepButton
              v-if="this.$route.name == 'home'
              || (this.$route.name == 'book' && !isMobile)
              || this.$route.name == 'recommend'
              || (this.$route.name == 'editor' && !isMobile)
              || this.$route.name == 'revision'"
              :buttonName="buttonName" @buttonClick="handleButtonClick"/>
          <ExportModal
              class="fixed"
              @closeModal="closeDropdown"
              v-if="isExportBannerDropOpen"
          />
          <MakeBookButton v-if="!isMobile && this.$route.name == 'editor'" @click="handleMakeBook" :style="{ 'pointer-events': this.disableMakeBookButton ? 'none':'auto' }"/>
          <RevisionCloseModal v-if="showRevisionCloseModal" @closeModal="handleCloseRevisionModal"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NextStepButton from '@/components/Top/NextStepButton.vue'
import ProgressBar from '@/components/Top/ProgressBar.vue'
import UndoRedoButton from '@/components/Top/UndoRedoButton.vue'
import SsdamLogo from '@/components/Top/SsdamLogo.vue'
import MakeBookButton from '@/components/Top/MakeBookButton.vue'
import RevisionCloseModal from '@/components/Top/RevisionCloseModal.vue'
import CustomerServiceButton from '@/components/Top/CustomerServiceButton.vue'
import BackButton from '@/components/Top/BackButton.vue'
import { RevisionStatus } from '@/store/constants/revisionStatus';
import ExportModal from "@/components/Top/ExportModal.vue";

  export default {
    data(){
      return{
        KAKAO_URL: "https://pf.kakao.com/_MuhQG/chat",
        KAKAO_OPEN_CHAT_URL: "https://open.kakao.com/o/gsHleNRg",
        screenWidth: window.innerWidth,
        disableMakeBookButton: false,
        creatingBook: false,
        isExportBannerDropOpen: false,
      }
    },
    components: {
      ExportModal,
      NextStepButton,
      ProgressBar,
      UndoRedoButton,
      SsdamLogo,
      MakeBookButton,
      RevisionCloseModal,
      CustomerServiceButton,
      BackButton
    },
    mounted() {
      window.addEventListener('resize', this.handleResize)
      // window.addEventListener('click', this.closeDropdown); // 클릭 이벤트 추가
      document.addEventListener('keydown', this.closeDropdown)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize)
      // window.addEventListener('click', this.closeDropdown); // 클릭 이벤트 추가
      document.removeEventListener('keydown', this.closeDropdown)
    },
    computed: {
      isDarkMode() {
        return this.$store.getters.isDarkMode
      },
      revisionResult() {
        return this.$store.getters.revisionResult
      },
      showMainChapterTitle() {
        let title = this.$store.getters.currentBook.book_schema.main_chapter.title
        if(title.length == 0) return '제목없음'
        return title
      },
      buttonName() {
        if (this.$route.name === 'book') {
          return '책 만들기'
        }
        else if (this.$route.name === 'recommend') {
          if(this.$store.getters.recommendProcess < 3){
            return '건너뛰기'
          }
          return '목차 구성'
        }
        else if (this.$route.name === 'editor') {
          if (this.$store.getters.showPrintModal) {
            return '내보내기'
          }
          return '퇴고하기'
        }
        else if (this.$route.name === 'revision') {
          return '일괄 반영'
        }
        return '몸통박치기'
      },
      showRevisionCloseModal() {
        return this.$store.getters.showRevisionCloseModal
      },
      showPrintModal() {
        return this.$store.getters.showPrintModal
      },
      screenWidthOverMaximum() {
        // return this.screenWidth > 939
        return this.screenWidth > 1164
      },
      screenWidthOverLarge() {
        return this.screenWidth > 800
      },
      isMobile() {
        return this.screenWidth < 660
      }
    },
    methods: {
      handleToggleDarkMode() {
        if(this.isDarkMode) {
          this.$store.commit('SET_DARK_MODE', false)
        }
        else {
          this.$store.commit('SET_DARK_MODE', true)
        }
      },
      handleResize() {
        this.screenWidth = window.innerWidth
      },
      handleTitleClick() {
        if(this.$route.name === 'revision') {
          this.$store.commit('SET_SHOW_REVISION_CLOSE_MODAL', 1)
          return
        }
        if (this.$route.name === 'recommend') {
          this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 2)
          return
        }
        if (this.$store.getters.isLoggedIn) {
          this.$router.push({ name: 'book' })
          return
        }
        this.$router.push({ name: 'login' })

      },
      handleBookShelfClick() {
        if(this.$route.name === 'revision') {
          this.$store.commit('SET_SHOW_REVISION_CLOSE_MODAL', 1)
          return
        }
        if (this.$route.name === 'recommend') {
          this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 2)
          return
        }
        this.$router.push({ name: 'book' })
      },
      async handleEditorClick() {
        if (this.$route.name === 'revision') {
          this.$store.commit('SET_SHOW_REVISION_CLOSE_MODAL', 2)
          return
        }
        if (this.$route.name === 'recommend') {
          if (this.$store.getters.recommendProcess < 3) {
            this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 1)
            return
          }
          this.sendGtagEvent('recommend_step_3',{
            total_section_count: this.$store.getters.totalSectionCount,
            total_deleted_section_count : this.$store.getters.deletedSectionCount,
            accept_rate: this.$store.getters.totalSectionCount == 0 ? 0 : (this.$store.getters.totalSectionCount - this.$store.getters.totalDeleteSectionCount) / this.$store.getters.totalSectionCount
          })
          if(this.creatingBook) return
          this.creatingBook = true
          await this.$store.dispatch('createPageByBookSchema');
          setTimeout(() => {
            this.creatingBook = false
          }, 2000);
          this.$router.push({ name: 'editor' })
          this.$store.commit('NEXT_RECOMMEND_PROCESS')
          return
        }
        this.$router.push({ name: 'editor' })
      },
      handleCustomerServiceClick() {
        window.open(this.KAKAO_URL, '_blank', 'noopener,noreferrer');
      },
      handleCommuicateButtonClick() {
        window.open(this.KAKAO_OPEN_CHAT_URL, '_blank', 'noopener,noreferrer');
      },
      async handleButtonClick() {
        if (this.$route.name === 'book') {
          if(this.creatingBook) return
          this.creatingBook = true
          await this.$store.dispatch('createNewBook');
          this.$store.commit('RESET_RECOMMEND_PROCESS')
          setTimeout(() => {
            this.creatingBook = false
          }, 2000);
          this.$router.push({name: 'recommend'});
        }
        else if (this.$route.name === 'recommend') {
          if (this.$store.getters.recommendProcess < 3) {
            this.$store.commit('SET_SHOW_RECOMMEND_CLOSE_MODAL', 1)
            return
          }
          this.sendGtagEvent('recommend_step_3',{
            total_section_count: this.$store.getters.totalSectionCount,
            total_deleted_section_count : this.$store.getters.deletedSectionCount,
            accept_rate: this.$store.getters.totalSectionCount == 0 ? 0 : (this.$store.getters.totalSectionCount - this.$store.getters.totalDeleteSectionCount) / this.$store.getters.totalSectionCount
          })
          if(this.creatingBook) return
          this.creatingBook = true
          try {
            await this.$store.dispatch('createPageByBookSchema');
          } catch (error){
            this.$store.commit('SET_ERROR_MESSAGE', '목차 구성 중 오류가 발생했습니다.')
            this.$store.commit('SET_SHOW_ERROR_MODAL', true)
          }
          setTimeout(() => {
            this.creatingBook = false
          }, 2000);
          this.$router.push({ name: 'editor' })
          this.$store.commit('NEXT_RECOMMEND_PROCESS')
        }
        else if (this.$route.name === 'editor') {
          if(this.$store.getters.showPrintModal) {
            this.openDropdown()
            // window.print()
          }
          else {
            if(!this.$store.getters.currentPageID) {
              this.$store.commit('SET_REVISION_STATE', RevisionStatus.NO_PAGE_SELECTED)
              return
            }
            if(this.isMobile) {
              this.$store.commit('SET_REVISION_STATE', RevisionStatus.MOBILE_NOT_SUPPORTED)
              return
            }
            this.$store.commit('SET_REVISION_STATE', RevisionStatus.LLM_REQUESTED)
          }
        }
        else if (this.$route.name === 'revision') {
          const fixTags = document.querySelectorAll('fix')
          for (let index = 0; index < this.revisionResult.length; index++) {
            if (!this.revisionResult[index].handled) {
              this.$gtag.event('revision-selection', {
                'revision-selected': 'approve',
                'original-text': this.revisionResult[index].originalText,
                'revised-text': this.revisionResult[index].revisedText
              })
              this.$store.dispatch('storeRevisionData', { originalText: this.revisionResult[index].originalText, revisedText: this.revisionResult[index].revisedText, isRevised: true })
              fixTags[index].childNodes[3].classList.remove('unfixed', 'focused')
              fixTags[index].childNodes[3].innerText = this.revisionResult[index].revisedText
              fixTags[index].childNodes[1].remove()
              this.revisionResult[index].handled = true
            }
          }
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.USER_CHECK_DONE)
        }
        else {
          this.$router.push({ name: 'book' })
        }
      },
      handleCloseRevisionModal() {
        this.$store.commit('SET_SHOW_REVISION_CLOSE_MODAL', 0)
      },
      handleMakeBook() {
        if(this.disableMakeBookButton) return
        if(this.$store.getters.saveForPrint) {
          this.$store.commit('SET_SAVE_FOR_PRINT', false)
        }
        this.disableMakeBookButton = true
        setTimeout(() => {
          this.disableMakeBookButton = false
        }, 1000)

        if(this.$store.getters.showPrintModal) {
          this.$store.commit('SET_SHOW_PRINT_MODAL', false)
          return
        }
        // If no editor component rendered to listen, force show print modal
        if(!this.$store.getters.currentPageID) {
          this.$store.commit('SET_SAVE_FOR_PRINT', false)
          this.$store.commit('SET_SHOW_PRINT_MODAL', true)
          return
        }

        this.$store.commit('SET_SAVE_FOR_PRINT', true)
        setTimeout(() => {
          this.$store.commit('SET_SHOW_PRINT_MODAL', true)
        }, 100)
      },
      sendGtagEvent(eventName, eventParams) {
        this.$gtag.event(eventName, eventParams);
      },
      openDropdown() {
        this.isExportBannerDropOpen = true;
      },
      closeDropdown() {
        this.isExportBannerDropOpen = false;
      },
      // 화면의 다른 곳 클릭 시 드롭다운을 닫는 메서드
      handleClickOutside() {
        // if(this.isExportBannerDropOpen == true){
        //   this.openDropdown();
        // }else{
        //   this.closeDropdown();
        // }
        // // const dropdown = this.$refs.dropdownMenu; // 드롭다운 메뉴 참조
        // const button = this.$refs.dropdownButton; // 드롭다운을 여는 버튼 참조
        //
        // // 드롭다운과 버튼을 제외한 영역을 클릭하면 드롭다운 닫기
        // if (dropdown && !dropdown.contains(event.target) && button && !button.contains(event.target)) {
        //   this.closeDropdown();
        // }
      },
    },
  }
</script>
