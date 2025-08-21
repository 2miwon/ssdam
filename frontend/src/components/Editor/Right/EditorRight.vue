<template>
  <div class="flex flex-col flex-grow bg-white border-t-0 border-r border-b-0 border-l-0 border-[#f2f2f2] z-10 overflow-y-auto">
    <div v-if="revisionDone" >
      <RevisionComponent v-if="!editorRightFolded"/>
      <!-- <EditorRightFoldButton/> -->
    </div>
    <div v-else class="flex justify-center items-center">
      <div class="flex flex-col justify-center items-center absolute top-1/2 transform -translate-y-1/2 gap-1">
        <img src="../../../../public/assets/progress.gif" alt="Loading..." class="w-auto h-auto justify-center items-center">
        <p class="self-stretch flex-grow-0 flex-shrink-0 text-2xl font-semibold text-center text-[#474747] pb-4">
          퇴고 진행 중
        </p>
        <p class="self-stretch flex-grow-0 flex-shrink-0 text-base font-semibold text-center text-[#727272]">
          한 문단 내 글자 양이 많을수록
        </p>
        <p class="self-stretch flex-grow-0 flex-shrink-0 text-base font-semibold text-center text-[#727272]">
          처리 시간이 길어집니다.
        </p>
        <p class="self-stretch flex-grow-0 flex-shrink-0 text-base font-semibold text-center text-[#727272]">
          {{ `예상 소요 시간: ${this.predictedTime}초`}}
        </p>
      </div>

    </div>
  </div>
</template>

<script>
import RevisionComponent from './RevisionComponent.vue';
// import EditorRightFoldButton from './EditorRightFoldButton.vue';
import { RevisionStatus } from '@/store/constants/revisionStatus';

  export default {
    computed: {
      editorRightFolded() {
        return this.$store.getters.editorRightFolded;
      },
      revisionDone() {
        return this.$store.getters.revisionState == RevisionStatus.LLM_DONE || this.$store.getters.revisionState == RevisionStatus.USER_CHECK_DONE;
      },
      predictedTime() {
        const x = this.$store.getters.maxBlockTextLength;
        return Math.ceil(-0.0000000085*x^3 + 0.0000131453*x^2 + 0.0139290598*x + 4.1911314744);
      },  
    },
    components: {
      RevisionComponent,
      // EditorRightFoldButton,
    },    
  }
</script>