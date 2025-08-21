<template>
  <div :class="['h-full bg-white border-r border-zinc-100 flex flex-col border-b z-10', this.leftBarStyles.width]">
    <div v-if="showBookLeftBar" class="p-4 md:p-6 flex-grow overflow-y-auto flex flex-col">
      <h2 :class="['text-zinc-900 text-lg font-bold font-Pretendard mb-4 text', this.leftBarStyles.textLocation]">나의 책장</h2>
      <div class="flex flex-col gap-2 mb-4">
        <div :class="['flex justify-between items-center h-[52px] relative p-2.5 rounded cursor-pointer hover:bg-[#f2f2f2]', this.bookShelfStyles.bg, this.leftBarStyles.leftBarWidth]"
          @click="handleBookShelfClick">
          <div class="flex justify-start items-center flex-shrink-0 relative gap-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
              preserveAspectRatio="none">
              <rect width="32" height="32" rx="4" :fill="[this.bookShelfStyles.rectFill]"></rect>
              <path
                d="M19.1467 18.7661L18.85 18.7973V23.5C18.85 23.9695 18.4695 24.35 18 24.35H8C7.53056 24.35 7.15 23.9695 7.15 23.5V7.5C7.15 7.03056 7.53056 6.65 8 6.65H13C13.4694 6.65 13.85 7.03056 13.85 7.5V7.65H14H18C18.4344 7.65 18.7929 7.97597 18.8438 8.39655L18.8635 8.55935L19.0239 8.52525L21.8028 7.93458C22.262 7.83699 22.7133 8.1301 22.8109 8.58928L22.8109 8.58929L25.7217 22.2834C25.8193 22.7426 25.5262 23.1939 25.067 23.2915L25.0982 23.4382L25.067 23.2915L21.1544 24.1232C20.6952 24.2208 20.2438 23.9276 20.1462 23.4684L19.9995 23.4996L20.1462 23.4684L19.1467 18.7661ZM14 9.35H13.85V9.5V17.5V17.65H14H17H17.15V17.5V9.5V9.35H17H14ZM13.85 22.5V22.65H14H17H17.15V22.5V19.5V19.35H17H14H13.85V19.5V22.5ZM12.15 8.5V8.35H12H9H8.85V8.5V18.5V18.65H9H12H12.15V18.5V8.5ZM12.15 20.5V20.35H12H9H8.85V20.5V22.5V22.65H9H12H12.15V22.5V20.5ZM21.3009 20.0029L21.1542 20.0341L21.1854 20.1808L21.6012 22.1369L21.6324 22.2836L21.7791 22.2524L23.7354 21.8365L23.8821 21.8053L23.8509 21.6586L23.4351 19.7026L23.4039 19.5559L23.2572 19.5871L21.3009 20.0029ZM20.7696 18.2245L20.8008 18.3712L20.9475 18.34L22.9038 17.9242L23.0505 17.893L23.0193 17.7463L21.3559 9.92088L21.3247 9.77416L21.178 9.80535L19.2218 10.2212L19.0751 10.2524L19.1063 10.3991L20.7696 18.2245Z"
                :fill="[this.bookShelfStyles.pathFill]"
                :stroke="[this.bookShelfStyles.pathStroke]"
                stroke-width="0.3">
              </path>
            </svg>
            <p :class="['flex-grow-0 flex-shrink-0 text-sm font-semibold text-center', this.bookShelfStyles.text, this.leftBarStyles.textLocation]">
              작가의 서재
            </p>
          </div>
          <p :class="['flex-grow-0 flex-shrink-0 text-base text-left', this.bookShelfStyles.count]">{{ bookCnt }}</p>
        </div>
        <div :class="['flex justify-between items-center flex-grow-0 flex-shrink-0 w-[241px] h-[52px] relative p-2.5 rounded cursor-pointer', isMobile ? '' : 'hover:bg-[#f2f2f2]', this.ideaShelfStyles.bg, this.leftBarStyles.leftBarWidth ]"
          @click="handleIdeaShelfClick">
          <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
              preserveAspectRatio="none">
              <rect width="32" height="32" rx="4" :fill="[this.ideaShelfStyles.rectFill]"></rect>
              <path
                d="M23.2596 24.1502H23.4096V24.0002V21.0002V20.8502H23.2596H10.2966C9.35985 20.8502 8.59107 21.5839 8.59107 22.5002C8.59107 23.4166 9.35985 24.1502 10.2966 24.1502H23.2596ZM14.0763 8.00024V7.85024H13.9263H9.7781C9.12771 7.85024 8.59107 8.36003 8.59107 9.00024V19.337V19.5708L8.80354 19.4734C9.25568 19.2663 9.7618 19.1502 10.2966 19.1502H23.2596H23.4096V19.0002V8.00024V7.85024H23.2596H21.1855H21.0355V8.00024V15.7463L17.6283 13.8689L17.5559 13.829L17.4835 13.8689L14.0763 15.7463V8.00024ZM6.81699 22.5002V9.00024C6.81699 7.43133 8.13754 6.15024 9.7781 6.15024H24.2966C24.7917 6.15024 25.1837 6.5359 25.1837 7.00024V25.0002C25.1837 25.4646 24.7917 25.8502 24.2966 25.8502H10.2966C8.36968 25.8502 6.81699 24.3453 6.81699 22.5002Z"
                fill="#B9B9B7"
                stroke="white"
                stroke-width="0.3">
              </path>
            </svg>
            <p :class="['flex-grow-0 flex-shrink-0 text-sm font-semibold text-center', this.ideaShelfStyles.text, this.leftBarStyles.textLocation]">
              아이디어 노트
            </p>
          </div>
          <!-- <p :class="['flex-grow-0 flex-shrink-0 text-base text-left', this.ideaShelfStyles.count]">{{ ideaCnt }}</p> -->
          <p :class="['flex-grow-0 flex-shrink-0 text-base text-left', this.ideaShelfStyles.count]"> 0 </p>
        </div>
        <div :class="['flex justify-between items-center flex-grow-0 flex-shrink-0 h-[52px] relative p-2.5 rounded cursor-pointer hover:bg-[#f2f2f2]', this.trashCanStyles.bg, this.leftBarStyles.leftBarWidth]"
          @click="handleTrashCanClick">
          <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
                preserveAspectRatio="none">
              <path
                  d="M20.617 10.4V10.45H20.667H25.2837V12.2166H23.467H23.417V12.2666V24.4C23.417 24.8878 23.0215 25.2833 22.5337 25.2833H9.46699C8.97914 25.2833 8.58366 24.8878 8.58366 24.4V12.2666V12.2166H8.53366H6.71699V10.45H11.3337H11.3837V10.4V7.59996C11.3837 7.11211 11.7791 6.71663 12.267 6.71663H19.7337C20.2215 6.71663 20.617 7.11211 20.617 7.59996V10.4ZM21.6503 12.2666V12.2166H21.6003H10.4003H10.3503V12.2666V23.4666V23.5166H10.4003H21.6003H21.6503V23.4666V12.2666ZM13.2003 8.48329H13.1503V8.53329V10.4V10.45H13.2003H18.8003H18.8503V10.4V8.53329V8.48329H18.8003H13.2003Z"
                  :fill="[this.trashCanStyles.pathFill]"
                  :stroke="[this.trashCanStyles.pathStroke]"
                  stroke-width="0.1"
              ></path>
            </svg>
            <p :class="['flex-grow-0 flex-shrink-0 text-sm font-semibold text-left', this.trashCanStyles.text]">
              휴지통
            </p>
          </div>
          <p :class="['flex-grow-0 flex-shrink-0 text-base text-left', this.trashCanStyles.count]">{{ deletedBookCnt }}</p>
        </div>

      </div>
      <div class="h-16 md:h-24"></div>
    </div>
    <div v-if="showBookLeftBar" class="p-4 md:p-6 border-zinc-100">
      <div class="flex flex-col">
        <div class="flex justify-center items-center h-[40px] rounded-lg hover:bg-[#f2f2f2] cursor-pointer" @click="handleServiceGuide">
          <p class="text-neutral-400 text-sm md:text-base font-medium">서비스 가이드</p>
        </div>
        <div class="flex justify-center items-center h-[40px] rounded-lg hover:bg-[#f2f2f2] cursor-pointer" @click="handleCustomerService">
          <button class="text-neutral-400 text-sm md:text-base font-medium hover:bg-[#f2f2f2]">문의하기</button>
        </div>
        <div class="flex justify-center items-center h-[40px] rounded-lg hover:bg-[#f2f2f2] cursor-pointer" @click="handleLogout">
          <button class="text-neutral-400 text-sm md:text-base font-medium hover:bg-[#f2f2f2]">로그아웃</button>
        </div>
      </div>
    </div>
    <IdeaModal v-if="showIdeaModal"
      :class="['fixed top-[62px] bg-white p-4 shadow-lg z-50', isMobile ? 'left-1/2 transform -translate-x-1/2' : 'left-1/2']"
      :isMobile="isMobile"></IdeaModal>
    <LogoutModal v-if="showLogoutModal"
      :class="['fixed top-[62px] bg-white p-4 shadow-lg z-50', isMobile ? 'left-1/2 transform -translate-x-1/2' : 'left-1/2']"
      :isMobile="isMobile"></LogoutModal>
  </div>
</template>

<script>
import IdeaModal from "@/components/Book/modal/IdeaModal.vue";
import router from "@/routes";
import LogoutModal from "@/components/Book/modal/LogoutModal.vue";
import { BookLeftBarStatus } from "@/store/constants/bookLeftBarStatus";

export default {
  data(){
    return{
      showIdeaModal: false,
      showLogoutModal: false,
      KAKAO_URL: "https://pf.kakao.com/_MuhQG/chat",
      screenWidth: window.innerWidth,
      BookLeftBarStatus
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    bookCnt() {
      return this.$store.getters.bookList.filter(book =>
          book.is_deleted === false || book.is_deleted === null
      ).length;
    },
    deletedBookCnt() {
      return this.$store.getters.bookList.filter(book =>
          book.is_deleted === true
      ).length;
    },
    bookLeftBarStatus() {
      return this.$store.getters.bookLeftBarStatus
    },
    bookShelfStyles() {
      const isBookshelf = !this.isMobile && this.bookLeftBarStatus === BookLeftBarStatus.BOOKSHELF;
      return {
        bg: isBookshelf ? 'bg-[#f9f4ff]' : '',
        text: isBookshelf ? 'text-[#5743d0]' : 'text-[#474747]',
        count: isBookshelf ? 'text-[#5743d0]' : 'text-[#a8a8a8]',
        rectFill: isBookshelf ? '#F9F4FF' : '',
        pathFill: isBookshelf ? '#5743D0' : '#B9B9B7',
        pathStroke: isBookshelf ? '#F9F4FF' : '',
      };
    },
    ideaShelfStyles() {
      const isIdeashelf = !this.isMobile && this.bookLeftBarStatus === BookLeftBarStatus.IDEASHELF;
      return {
        bg: isIdeashelf ? 'bg-[#f9f4ff]' : '',
        text: isIdeashelf ? 'text-[#5743d0]' : 'text-[#474747]',
        count: isIdeashelf ? 'text-[#5743d0]' : 'text-[#a8a8a8]',
        rectFill: isIdeashelf ? '#F9F4FF' : '',
        pathFill: isIdeashelf ? '#5743D0' : '#B9B9B7',
        pathStroke: isIdeashelf ? '#F9F4FF' : '',
      };
    },
    trashCanStyles() {
      const isTrashCan = !this.isMobile && this.bookLeftBarStatus === BookLeftBarStatus.TRASHCAN;
      return {
        bg: isTrashCan ? 'bg-[#f9f4ff]' : '',
        text: isTrashCan ? 'text-[#5743d0]' : 'text-[#474747]',
        count: isTrashCan ? 'text-[#5743d0]' : 'text-[#a8a8a8]',
        rectFill: isTrashCan ? '#F9F4FF' : '',
        pathFill: isTrashCan ? '#5743D0' : '#B9B9B7',
        pathStroke: isTrashCan ? '#F9F4FF' : '',
      };
    },
    isMobile() {
      return this.screenWidth < 660
    },
    isFolded() {
      return this.$store.getters.bookLeftBarFolded
    },
    leftBarStyles() {
      if(this.isMobile) {
        if (this.isFolded) { // 접혀있음
          return {
            width: 'w-0',
          }
        } else { // 펼쳐짐
          return {
            width : 'w-full',
            leftBarWidth: 'w-[92vw]'
          }
        }
      }
      return { // 펼쳐짐
        width: 'w-[290px]',
        leftBarWidth: 'w-[241px]'
      }
    },
    showBookLeftBar(){
      if(this.isMobile && !this.isFolded){
        return true;
      }
      if(this.isMobile && this.isFolded){ //접혀있음
        return false;
      }
      return true;
    }
  },
  components:{
    LogoutModal,
    IdeaModal
  },

  methods: {
    handleBookShelfClick() {
      this.$store.commit('SET_BOOK_LEFT_BAR_STATUS', BookLeftBarStatus.BOOKSHELF)
      if(this.isMobile){
        this.$store.commit('SET_BOOK_LEFT_BAR_FOLDED', true)
      }
    },
    handleIdeaShelfClick() {
      this.showIdeaModal = true
      setTimeout(() => {
        this.showIdeaModal = false
      }, 1500)
      // this.$router.push({ name: 'idea' })
      // if(this.isMobile){
      //   this.$store.commit('SET_BOOK_LEFT_BAR_FOLDED', true)
      // }
    },
    handleTrashCanClick(){
      this.$store.commit('SET_BOOK_LEFT_BAR_STATUS', BookLeftBarStatus.TRASHCAN)
      if(this.isMobile){
        this.$store.commit('SET_BOOK_LEFT_BAR_FOLDED', true)
      }
    },
    handleLogout(){
      this.$store.dispatch('logOut')
      this.showLogoutModal = true
      setTimeout(() => {
        router.push({ name: 'login' }) // 로그인 페이지로 이동
        this.showLogoutModal = false
      }, 500)
    },
    handleCustomerService(){
      window.open(this.KAKAO_URL, '_blank', 'noopener,noreferrer');
    },
    handleServiceGuide(){
      window.open('https://donhdonot.notion.site/99ec07b23be64dbba51aee71fb8ea734?pvs=4', '_blank');
    },
    handleResize() {
      this.screenWidth = window.innerWidth
    }
  }
}
</script>