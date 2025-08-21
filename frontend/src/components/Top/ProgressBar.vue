<template>
  <div v-if="currentStepArray[0]!=-1" class="flex justify-center items-center relative">
    <div v-for="(i,index) in 4" :key="index" class="flex items-center">
      <p class="flex-grow-0 flex-shrink-0 text-xs font-bold text-left text-[#1b1b1b] mr-[9px]"
        :class="{ 'cursor-waiting':creatingBook, 'text-[#b3b7bc]':currentStepArray[index]==-1,
        'text-[#b3b7bc] cursor-pointer':currentStepArray[index]==0, 'text-[#5743d0]':currentStepArray[index]==1  }"
        @click="handleClick(index)">
        {{ textList[index] }}
      </p>
      <svg v-if="index<3"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-4 h-4 relative mr-[9px]"
        preserveAspectRatio="none">
        <path
          d="M8.78115 8.00047L5.9527 5.17203C5.69235 4.91168 5.69235 4.48956 5.9527 4.22921C6.21305 3.96887 6.63516 3.96887 6.89551 4.22922L9.95964 7.29336C10.3502 7.68388 10.3502 8.31705 9.95963 8.70757L6.8955 11.7717C6.63516 12.032 6.21305 12.032 5.95271 11.7717C5.69235 11.5113 5.69235 11.0892 5.95271 10.8289L8.78115 8.00047Z"
          fill="#CDCDCD">
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
import { RevisionStatus } from '@/store/constants/revisionStatus';

  export default {
    emits: ['clickEditor'],
    data() {
      return {
        textList: [
          '목차 구성하기',
          '집필하기',
          '퇴고하기',
          '책 완성'
        ],
        creatingBook: false
      };
    },
    computed: {
      currentStepArray() {
        // 0 => gray, 1 => purple, -1 => disabled
        if (this.$route.name == 'recommend'){
          return [1,0,-1,-1];
        }
        else if (this.$route.name === 'editor') {
          return [0,1,0,-1];
        } 
        else if (this.$route.name === 'revision') {
          return [0,0,1,-1];
        }
        // else if (this.$route.name === 'complete') {
        //   return [0,0,0,1];
        // }
        else {
          return [-1,-1,-1,-1];
        }
      },
      isMobile() {
        return this.screenWidth < 660
      }
    },
    methods: {
      async handleClick(index) {
        if(index === 0) {
          if(this.creatingBook) return
          this.creatingBook = true
          await this.$store.dispatch('createNewBook');
          this.$store.commit('RESET_RECOMMEND_PROCESS')
          setTimeout(() => {
            this.creatingBook = false
          }, 2000);
          this.$router.push({name: 'recommend'});
        }
        if(index === 1) {
          this.$emit('clickEditor')
        }
        else if(index === 2) {
          if(this.$route.name == 'editor' && !this.$store.getters.showPrintModal) {
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
      },
    },
    
  }
</script>