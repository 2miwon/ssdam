<template>
  <div :class="['flex flex-col justify-center items-center gap-2.5 px-[46px] py-3.5 rounded-xl bg-white border', this.borderLine ] "
      style="box-shadow: 0px 6px 10.899999618530273px 0 #e1e4e7;">
    <div class="flex justify-start items-end flex-grow-0 flex-shrink-0 relative gap-3">
      <RevisionStateSvg :borderLine="borderLine"/>
      <p class="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#1b1b1b]">
        {{message}}
      </p>
    </div>
  </div>
</template>

<script>
import { RevisionStatus } from '@/store/constants/revisionStatus';
import RevisionStateSvg from "@/components/Editor/Center/RevisionStateSvg.vue";

export default {
  components: {RevisionStateSvg},
  props: ['revisionState'],
  computed: {
    message(){
      if(this.revisionState == RevisionStatus.LLM_FAIL){
        return "요청을 처리하는 동안 문제가 발생했습니다. 재시도 해주세요."
      } else if(this.revisionState == RevisionStatus.EMPTY_REVISION){
        return "퇴고 사항이 없습니다. 훌륭한 글입니다."
      } else if(this.revisionState == RevisionStatus.EMPTY_INPUT){
        return "한 문단 이상의 글을 작성해주세요."
      } else if(this.revisionState == RevisionStatus.TEXT_OVER_LIMIT_SINGLE_BLOCK){
        return "한 문단의 글자 수가 너무 많습니다. 1000자 이내로 작성해주세요."
      } else if(this.revisionState == RevisionStatus.USER_CHECK_DONE){
        return "퇴고가 완료되었어요."
      } else if(this.revisionState == RevisionStatus.INK_COIN_LIMIT_EXCEEDED){
        return "일일 사용 가능한 퇴고 기능을 모두 소진하였습니다."
      } else if(this.revisionState == RevisionStatus.TOO_MANY_CONCURRENT_REVISION){
        return "현재 너무 많은 사용자가 퇴고를 요청하고 있습니다. 잠시 후 다시 시도해주세요."
      } else if(this.revisionState == RevisionStatus.NO_PAGE_SELECTED) {
        return "퇴고할 페이지를 선택해주세요."
      } else if(this.revisionState == RevisionStatus.MOBILE_NOT_SUPPORTED){
        return "퇴고 기능은 모바일 환경을 지원하지 않습니다."
      }
      return "몸통 박치기! 이스터에그를 찾으셨습니다."
    },
    borderLine(){
      if(this.revisionState == RevisionStatus.INK_COIN_LIMIT_EXCEEDED){
        return 'border-[#ff7171]/30'
      }else if(this.revisionState == RevisionStatus.EMPTY_INPUT || this.revisionState == RevisionStatus.LLM_FAIL 
        || this.revisionState == RevisionStatus.TEXT_OVER_LIMIT_SINGLE_BLOCK || this.revisionState == RevisionStatus.NO_PAGE_SELECTED
        || this.revisionState == RevisionStatus.MOBILE_NOT_SUPPORTED || this.revisionState == RevisionStatus.TOO_MANY_CONCURRENT_REVISION){ 
        return 'border-[#ffd402]/30'
      }
      return 'border-[#1ebc4a]/30'
    }
  }
}
</script>