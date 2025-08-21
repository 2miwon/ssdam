<template>
  <div v-if="!this.isMobile" class="flex">
    <EditorLeft class="fixed w-[273px] h-[95%]"/>
    <EditorCenter class="fixed left-[273px] overflow-y-auto" 
      :class="{ 'w-[calc(100%-337px)]':editorRightFolded, 'w-[calc(100%-646px)]':!editorRightFolded }"/>
    <EditorRight class="fixed right-0 h-[95%]" 
      :class="{ 'w-[64px]':editorRightFolded, 'w-[373px]':!editorRightFolded }"/>
    <div v-if="!checkRevisionWatched">
      <div v-if="this.revisionOnboardingProcess==2" 
        class="absolute top-[10px] right-[335px]">
        <OnBoardingMessage :pointerPosition="1" :message="'일괄 반영 버튼을 눌러'" :messageTwo="'수정 사항들을 한 번에 반영하세요!'" @close="handleLastOnboarding"/>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center">
    <MobileBlockingMessage/>
  </div>
</template>

<script>
import EditorLeft from '@/components/Editor/Left/EditorLeft.vue'
import EditorCenter from '@/components/Editor/Center/EditorCenter.vue'
import EditorRight from '@/components/Editor/Right/EditorRight.vue'
import MobileBlockingMessage from '@/components/MobileBlockingMessage.vue'
import OnBoardingMessage from '@/components/OnBoardingMessage.vue'

export default {
  computed: {
    editorRightFolded() {
      return this.$store.getters.editorRightFolded;
    },
    isMobile() {
      return this.screenWidth < 660
    },
    title() {
      return this.$store.getters.currentBook.book_schema.main_chapter.title
    },
    checkRevisionWatched() {
      return this.$store.getters.checkRevisionWatched
    },
    revisionOnboardingProcess() {
      return this.$store.getters.revisionOnboardingProcess
    },
  },
  components: {
    EditorLeft,
    EditorCenter,
    EditorRight,
    MobileBlockingMessage,
    OnBoardingMessage
  },
  watch: {
    title() {
      document.title = `${(this.title.length==0 ? '제목없음' : this.title)} - 퇴고`
    }
  },
  mounted() {
    document.title = `${this.title.length==0 ? '제목없음' : this.title} - 퇴고`
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth
    },
    handleLastOnboarding() {
      this.$store.dispatch('updateUser', 2)
    },
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