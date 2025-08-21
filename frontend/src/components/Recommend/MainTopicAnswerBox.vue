<template>
  <div class="w-[65vw] h-[12vh] mx-auto min-h-16 py-2" >
    <div class="flex justify-start items-center w-[1344px] relative gap-2.5 py-4">
      <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-[27px] py-2 rounded-[39px]" style="background: linear-gradient(129.78deg, #4343d0 19.07%, #900afa 93.09%);">
        <p class="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-white">{{ mainTopic }}</p>
      </div>
      <p class="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#1b1b1b]">
        을 이야기하고 싶어요
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      currentQuestionIndex: 0
    }
  },
  computed: {
    mainQuestionList(){
      return this.$store.getters.mainQuestionList
    },
  },

  props: ['mainTopic'],

  methods:{
    handleRegen() {
      this.currentQuestionIndex = (this.currentQuestionIndex + 1)%this.mainQuestionList.length
    },
  },
}
</script>

<style lang="scss" scoped>

</style>