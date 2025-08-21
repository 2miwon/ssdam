<template>
  <div class="flex flex-col justify-start items-start absolute left-8 top-[42px] gap-2">
    <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
      <RevisionBanner :userCheckLeft="this.userCheckLeft"/>
      <div v-for="(revision,index) in showList" :key="index">
        <RevisionBox :focused="revision.index==currentFocus" :index="revision.index" :reason="revision.reason" 
          :originalText="revision.originalText" :revisedText="revision.revisedText"
          @focus="handleFocus(revision.index)" @ignore="handleIgnore(revision.index)" @approve="handleApprove(revision.index)"/>
        <div v-if="index==0&&!checkRevisionWatched">
          <div v-if="this.revisionOnboardingProcess==0" 
            class="ml-[25px]">
            <OnBoardingMessage :pointerPosition="1" :message="'수정된 문구가 마음에 드시나요?'" :messageTwo="'수정 항목의 체크 버튼을 눌러 수정 사항을 반영해보세요!'" @close="handleCloseOnboarding"/>
          </div>
          <div v-if="this.revisionOnboardingProcess==1"
            class="ml-[-7px]">
            <OnBoardingMessage :pointerPosition="1" :message="'수정된 문구가 마음에 들지 않으신가요?'" :messageTwo="'휴지통 버튼을 눌러 원래 글을 유지하세요!'" @close="handleCloseOnboarding"/>
          </div>
        </div>
      </div>
    </div>
    <PaginationButton @leftClick="handleLeftClick" @rightClick="handleRightClick"
      :leftNumber="currentPagination" :rightNumber="maxPagination"/>  
  </div>
</template>

<script>
import RevisionBanner from '@/components/Editor/Right/RevisionBanner.vue'
import RevisionBox from '@/components/Editor/Right/RevisionBox.vue'
import PaginationButton from '@/components/Editor/Right/PaginationButton.vue'
import { RevisionStatus } from '@/store/constants/revisionStatus'  
import OnBoardingMessage from '@/components/OnBoardingMessage.vue'

  export default {
    data() {
      return {
        currentPagination: 1,
        showNumber: 4,
        currentFocus: 0,
        showList: [],
      }
    },
    computed: {
      revisionResult() {
        return this.$store.getters.revisionResult
      },
      userCheckLeft() {
        return this.$store.getters.userCheckLeft
      },
      maxPagination() {
        return Math.ceil(this.userCheckLeft / this.showNumber)
      },
      checkRevisionWatched() {
        return this.$store.getters.checkRevisionWatched
      },
      revisionOnboardingProcess() {
        return this.$store.getters.revisionOnboardingProcess
      },
    },
    mounted() {
      this.refreshShowList()
      this.$store.commit('SET_REVISION_ONBOARDING_PROCESS', 0)
    },
    watch: {
      revisionResult() {
        this.refreshShowList()
      },
      currentPagination() {
        this.refreshShowList()
      },
    },
    components: {
      RevisionBanner,
      RevisionBox,
      PaginationButton,
      OnBoardingMessage,
    },
    methods: {
      handleCloseOnboarding() {
        this.$store.commit('SET_REVISION_ONBOARDING_PROCESS', this.revisionOnboardingProcess+1)
      },
      handleFocus(index) {
        const fixTags = document.querySelectorAll('fix')
        if (this.currentFocus!=-1 && fixTags[this.currentFocus]) {
          fixTags[this.currentFocus].childNodes[3].classList.remove('focused')
        }
        this.currentFocus = index
        if (fixTags[this.currentFocus]) {
          fixTags[this.currentFocus].scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
          fixTags[this.currentFocus].childNodes[3].classList.add('focused')
        }
      },
      refreshShowList() {
        this.showList = []
        let countingIndex = 0
        for (let i=0; i< this.revisionResult.length; i++) {
          if (!this.revisionResult[i].handled) {
            countingIndex++
          }
        }
        if(countingIndex == 0) {
          const fixTags = document.querySelectorAll('fix')
          for (let index = 0; index < this.revisionResult.length; index++) {
            fixTags[index].childNodes[3].classList.remove('unfixed', 'focused')
            fixTags[index].childNodes[1].remove()
          }
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.USER_CHECK_DONE)
          return
        }
        else if(countingIndex <= this.showNumber * (this.currentPagination - 1)) {
          this.currentPagination = Math.max(this.currentPagination - 1, 1)
        }

        countingIndex = 0
        for (let i = 0; i < this.revisionResult.length; i++) {
          if (!this.revisionResult[i].handled){
            if (Math.ceil((countingIndex+1)/this.showNumber) == this.currentPagination) {
              this.showList.push(this.revisionResult[i])
            }
            countingIndex++
          }
        }
        this.$store.commit('SET_USER_CHECK_LEFT', countingIndex)
      },
      handleLeftClick() {
        if(this.currentPagination == 1) return
        this.currentPagination--
        this.handleFocus((this.currentPagination-1) * this.showNumber)
      },
      handleRightClick() {
        if(this.currentPagination == this.maxPagination) return
        this.currentPagination++
        this.handleFocus((this.currentPagination-1) * this.showNumber)
      },
      handleIgnore(index) {
        this.$gtag.event('revision-selection', {
          'revision-selected': 'ignore',
          'original-text': this.revisionResult[index].originalText,
          'revised-text': this.revisionResult[index].revisedText
        })
        const fixTags = document.querySelectorAll('fix')
        fixTags[index].childNodes[1].classList.add('hidden')
        fixTags[index].childNodes[3].classList.remove('unfixed', 'focused')
        this.revisionResult[index].handled = true
        this.storeRevisionData(this.revisionResult[index].originalText, this.revisionResult[index].revisedText, false)
        this.refreshShowList()
      },
      handleApprove(index) {
        this.$gtag.event('revision-selection', {
          'revision-selected': 'approve',
          'original-text': this.revisionResult[index].originalText,
          'revised-text': this.revisionResult[index].revisedText
        })
        const fixTags = document.querySelectorAll('fix')
        fixTags[index].childNodes[1].classList.add('hidden')
        fixTags[index].childNodes[3].classList.remove('unfixed', 'focused')
        fixTags[index].childNodes[3].innerText = this.revisionResult[index].revisedText
        this.revisionResult[index].handled = true
        this.storeRevisionData(this.revisionResult[index].originalText, this.revisionResult[index].revisedText, true)
        this.refreshShowList()
      },
      storeRevisionData(originalText, revisedText, isRevised){
        this.$store.dispatch('storeRevisionData', { originalText: originalText, revisedText: revisedText, isRevised : isRevised})
      }
    } 
    
  }
</script>