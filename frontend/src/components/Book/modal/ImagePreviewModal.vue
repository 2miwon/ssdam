<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="closeModal">
    <div class="bg-white pb-5 rounded-md max-w-[26vw] pt-[30px] w-full flex flex-col items-center" @click.stop>
      <div class="relative">
        <img :src="imageUrl" alt="이미지 미리보기" class="max-w-full h-[60vh] mb-4 rounded-tr-2xl rounded-br-2xl object-cover">
        <div class="w-[10%] h-[60vh] left-0 top-0 absolute bg-yellow-50"></div>
        <div class="flex justify-end w-full">
          <button @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-[#f2f2f2] transition duration-200">
            닫기
          </button>
          <button @click="confirmUpload" class="px-4 py-2 bg-[#5743d0] hover:bg-[#6146FF] text-white rounded-md transition duration-200">
            업로드
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    imageUrl: String
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmUpload() {
      this.$emit('confirm');
    }
  }
}
</script>