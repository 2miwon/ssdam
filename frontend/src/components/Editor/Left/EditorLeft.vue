<template>
  <div v-if="!isMobile||!editorLeftFolded"
    class="flex flex-col flex-grow overflow-hidden bg-white border-t-0 border-r border-b-0 border-l-0 border-[#f2f2f2] z-10">
    <BookSchemaDisplay class="overflow-y-auto"/>
    <div v-if="this.$route.name=='editor'">
      <AddSub/>
      <TrashButton/>
    </div>
  </div>
</template>

<script>
import BookSchemaDisplay from '@/components/Editor/Left/BookSchemaDisplay.vue'
import AddSub from '@/components/Editor/Left/AddSub.vue'
import TrashButton from '@/components/Editor/Left/TrashButton.vue'

export default {
  components: {
    BookSchemaDisplay,
    AddSub,
    TrashButton,
  },
  computed: {
    isMobile() {
      return window.innerWidth < 660
    },
    editorLeftFolded() {
      return this.$store.getters.editorLeftFolded;
    },
  },
};
</script>
