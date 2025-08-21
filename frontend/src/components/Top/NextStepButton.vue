<template>
  <div v-if="buttonDisabled">
    <div disabled class="flex justify-center items-center w-[77px] h-[37px] relative gap-2.5 p-2.5 rounded-lg bg-[#b3b7bc]">
      <button disabled class="flex-grow-0 flex-shrink-0 text-[13px] font-bold text-left text-white">{{ buttonName }}</button>
    </div>
  </div>
  <div v-else @click="handleClick">
    <div class="flex justify-center items-center w-[77px] h-[37px] relative gap-2.5 p-2.5 rounded-lg bg-[#5743d0] cursor-pointer hover:bg-[#6146FF]">
      <button class="flex-grow-0 flex-shrink-0 text-[13px] font-bold text-left text-white">{{ buttonName }}</button>
    </div>
  </div>
</template>

<script>
import { RevisionStatus } from '@/store/constants/revisionStatus'

  export default {
    props: ['buttonName'],
    emits: ['buttonClick'],
    methods: {
      handleClick() {
        this.$emit('buttonClick')
      }
    },
    computed: {
      buttonDisabled() {
        return (this.$route.name=='revision' && this.$store.getters.revisionState != RevisionStatus.LLM_DONE)
      }
    }
  }
</script>