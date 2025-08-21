<template>
  <div class="bg-sky-50 mb-[20px]">
    <div class="flex items-center justify-center mb-5 mt-5">
      <p class="text-[27px] sm:text-4xl font-bold bg-gradient-to-r from-[#17AFF0] to-[#5743d0] text-transparent bg-clip-text">쓰담과 함께 출판한 책</p>
    </div>
    <!-- <div class="absolute w-full h-[500px]"></div> -->
    <div class="flex w-full justify-center items-center">
    <!-- Left gradient overlay -->
    <div class="absolute h-[488px] left-0 w-[10%] pointer-events-none"
         style="background: linear-gradient(to right, rgb(240 249 255), rgb(240 249 255 / 0))">
    </div>
    
    <!-- Right gradient overlay -->
    <div class="absolute h-[488px] right-0 w-[10%] pointer-events-none"
         style="background: linear-gradient(to left, rgb(240 249 255), rgb(240 249 255 / 0))">
    </div>

      <div class="flex overflow-x-auto pb-6 gap-6 scrollbar-hide w-full"
        :class="{ 'justify-center items-center': !isSmallScreen, }"
        ref="scrollContainer"
        @mouseenter="pauseScroll"
        @mouseleave="resumeScroll"
        @wheel="handleWheel">
        <div v-for="n in Array.from({ length: 10})" :key="n" class="flex gap-6">
          <PublishedBookComponent 
            href="https://product.kyobobook.co.kr/detail/S000214657095" 
            imageSrc="/assets/publish/biodiversity.png"
            imageAlt="Biodiversity book cover"
            bookType="교양과학"
            bookTitle="생물다양성, 기후변화 그리고 생태세"
            bookAuthor="김기대"
            bookPublisher="퍼플"
            :bookPublished="true"/>

          <PublishedBookComponent
            href="https://product.kyobobook.co.kr/detail/S000214722228" 
            imageSrc="/assets/publish/cactusflower.png"
            imageAlt="cactusflower book cover"
            bookType="에세이"
            bookTitle="나의 선인장에 꽃을 피울 수 있을까"
            bookAuthor="오현수"
            bookPublisher="퍼플"
            :bookPublished="true"/>

          <PublishedBookComponent
            href="https://product.kyobobook.co.kr/detail/S000214702945" 
            imageSrc="/assets/publish/baking.png"
            imageAlt="baking book cover"
            bookType="실용"
            bookTitle="베이킹 공방 창업 이건 꼭 알고 시작하자"
            bookAuthor="김은희"
            bookPublisher="퍼플"
            :bookPublished="true"/>

          <PublishedBookComponent
            href="https://bookk.co.kr/bookStore/672c494c6a28d580bedd8e1d" 
            imageSrc="/assets/publish/menopause.png"
            imageAlt="menopause book cover"
            bookType="에세이"
            bookTitle="내 남자의 갱년기"
            bookAuthor="손유진"
            bookPublisher="부크크"
            :bookPublished="true"/>

          <PublishedBookComponent
            href="https://bookk.co.kr/bookStore/6729ffdf322594814e4028ac" 
            imageSrc="/assets/publish/steel.png"
            imageAlt="steel book cover"
            bookType="에세이"
            bookTitle="나는 철이 들까요"
            bookAuthor="김유진"
            bookPublisher="부크크"
            :bookPublished="true"/>

          <PublishedBookComponent
            href="https://bookk.co.kr/bookStore/672d7384dc68a76fc769e24c" 
            imageSrc="/assets/publish/workermental.png"
            imageAlt="workermental book cover"
            bookType="자기계발"
            bookTitle="직장인을 위한 멘탈 관리와 자아 성장 가이드"
            bookAuthor="이화영"
            bookPublisher="부크크"
            :bookPublished="true"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import PublishedBookComponent from './PublishedBookComponent.vue';
export default {
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.startScroll();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.stopScroll();
  },
  components: {
    PublishedBookComponent
  },
  data() {
    return {
      screenWidth: window.innerWidth,
      scrollAmount: 0,
      scrollSpeed: 2,
      scrollInterval: null,
      isPaused: false,
    }
  },
  methods: {
    handleWheel(event) {
      // Check if the user is trying to scroll horizontally directly
      if (event.deltaX !== 0) {
        event.preventDefault();
        return;
      }
      
      // Check if the user is holding shift while scrolling vertically
      // (which typically causes horizontal scrolling)
      if (event.shiftKey && event.deltaY !== 0) {
        event.preventDefault();
        return;
      }

      // If user is just scrolling vertically (without shift),
      // let the event proceed normally
    },
    handleResize() {
      this.screenWidth = window.innerWidth
    },
    startScroll() {
      if (this.scrollInterval) return;

      this.scrollInterval = setInterval(() => {
        if (this.isPaused) return;

        const container = this.$refs.scrollContainer;
        if (!container) return;

        // Increment scroll amount
        this.scrollAmount += this.scrollSpeed;

        // Check if we've reached the end (including the duplicate first item)
        if (this.scrollAmount >= container.scrollWidth - container.clientWidth) {
          // Reset to the beginning instantly
          this.scrollAmount = 0;
          container.scrollLeft = 0;
        } else {
          // Normal scroll
          container.scrollLeft = this.scrollAmount;
        }        
      }, 30);
    },

    stopScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
      }
    },

    pauseScroll() {
      this.scrollSpeed = 1;
      // this.isPaused = true;
    },

    resumeScroll() {
      this.scrollSpeed = 2;
      // this.isPaused = false;
    },
  },
  computed: {
    isSmallScreen() {
      return this.screenWidth< 1450
    }
  },
}
</script>
