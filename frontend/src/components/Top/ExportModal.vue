<template>
  <div>
    <div class="fixed flex-col right-[40px] top-[49px] w-[150px] bg-white border border-[#f2f2f2] rounded-2xl shadow-lg z-30">
      <div @click="handleExportToPdf" class="block flex justify-start items-center w-full h-[50px] px-4 py-2 hover:bg-gray-100">
        <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#474747]">
          Pdf로 내보내기
        </p>
      </div>
      <div @click="handleExportToDocx" class="block flex justify-start items-center w-full h-[50px] px-4 py-2 hover:bg-gray-100">
        <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#474747]">
          Word로 내보내기
        </p>
      </div>
    </div>
    <div class="fixed top-0 left-0 w-full h-full z-20" @click="handleCloseModal"></div>
  </div>
</template>

<script>
export default {
  emits: ['closeModal', 'exportToPdf', 'exportToWord'],
  methods: {
    handleCloseModal() {
      this.$emit('closeModal');
    },
    handleExportToPdf() {
      this.$gtag.event('export-pdf',{})
      window.print()
      this.handleCloseModal()
    },
    handleExportToDocx() {
      this.$gtag.event('export-docx',{})
      this.$store.commit('EXPORT_TO_DOCX')
      this.handleCloseModal()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>