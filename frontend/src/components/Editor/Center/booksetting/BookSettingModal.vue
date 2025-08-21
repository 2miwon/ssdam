<template>
  <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col px-10 py-8 rounded-xl z-30 bg-white"
       :class="[ isMobile ? 'w-[376px] h-[502px]' : 'w-[638px] h-[502px]']"
       style="box-shadow: 0px 0px 12.100000381469727px 0 rgba(107,107,107,0.25);">
    <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8">
      <div class="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <div class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
          <p class="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-[#1b1b1b]">
            책 맞춤 설정
          </p>
          <div
              class="cursor-pointer rounded hover:bg-[#f2f2f2]"
              @click="closeModal">
          <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
              preserveAspectRatio="none"
          >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.1163 12L5.90144 6.78509L6.78532 5.9012L12.0002 11.1161L17.2151 5.9012L18.099 6.78509L12.8841 12L18.099 17.2149L17.2151 18.0988L12.0002 12.8839L6.78532 18.0988L5.90144 17.2149L11.1163 12Z"
                fill="#636C78"
                stroke="#636C78"
                stroke-width="0.5"
            ></path>
          </svg>
          </div>
        </div>
        <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-1.5">
          <div
              v-for="(category, index) in categories"
              :key="index"
              @click="handleSettingCategory(category)"
              :class="['flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2.5 py-1 rounded-[100px] cursor-pointer',
              category === this.nowCategory ? 'bg-[#474747] text-white border border-[#474747]' : 'border border-[#f2f2f2] text-[#474747] hover:bg-[#f2f2f2]']">
            <p class="flex-grow-0 flex-shrink-0 text-xs font-medium text-center">{{ category }}</p>
          </div>
        </div>
      </div>
      <TopicForms v-if="this.nowCategory ==='책 주제'"></TopicForms>
      <PurposeForm v-if="this.nowCategory === '집필 목적'"></PurposeForm>
      <ReaderForm v-if="this.nowCategory === '대상 독자'"></ReaderForm>
      <StyleForm v-if="this.nowCategory === '개인 문체'"></StyleForm>
      <div class="hover-button flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] relative gap-2.5 p-2.5 rounded-lg bg-[#5743d0] cursor-pointer hover:bg-[#6146ff]"
           @click.stop="handleUpdateCustomSetting">
        <p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-white z-10">저장하기</p>
      </div>
    </div>
<!--    <div class="hover-button flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] relative gap-2.5 p-2.5 rounded-lg bg-[#5743d0] cursor-pointer hover:bg-[#6146ff]"-->
<!--         @click.stop="handleUpdateCustomSetting">-->
<!--      <p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-white z-10">저장하기</p>-->
<!--    </div>-->
  </div>
</template>

<script>
import TopicForms from "@/components/Editor/Center/booksetting/TopicForms.vue";
import PurposeForm from "@/components/Editor/Center/booksetting/PurposeForm.vue";
import ReaderForm from "@/components/Editor/Center/booksetting/TargetForm.vue";
import StyleForm from "@/components/Editor/Center/booksetting/StyleForm.vue";

export default {
  components: { TopicForms, PurposeForm, ReaderForm, StyleForm },
  data() {
    return {
      nowCategory: '책 주제',
      categories: ['책 주제', '집필 목적', '대상 독자', '개인 문체']
    }
  },
  emits: ['close'],
  methods: {
    closeModal(){
      this.$emit('close')
    },
    handleSettingCategory(category) {
      this.nowCategory = category
    },
    handleUpdateCustomSetting(){
      this.closeModal()
      this.$store.dispatch('updateBookSetting');
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    }
  }
}
</script>

<style scoped>
.hover-button {
  background: linear-gradient(129.78deg, #4343d0 19.07%, #900afa 93.09%);
  position: relative;
}

.hover-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #6146ff; /* Adjust the color and transparency as needed */
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.hover-button:hover::before {
  opacity: 1;
}
</style>