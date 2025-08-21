<template>
  <div class="flex flex-col justify-center items-center gap-4 flex-shrink-0 flex-grow-0 w-[320px] h-[400px] rounded-[25.77px] bg-white border hover:scale-110 mt-8 mb-8 cursor-pointer" 
    style="box-shadow: 0px 0px 14.349px 0 rgba(173,176,186,0.16);"
    @click="handleGoRef">
    <div class="p-4">

      <div class="flex justify-center items-center">
        <img :src="imageSrc" :alt="imageAlt" class="flex justify-center items-center h-[280px]">
      </div>

      <div class="flex flex-col pt-2">
        <p class="text-sm text-[#727272] no-underline">{{ bookType }}</p>
        <div class="hover:underline">
          <p class="font-semibold text-base">{{ bookTitle }}</p>
        </div>
        <p class="text-sm text-[#727272] no-underline">
          {{ bookAuthor }} · {{ bookPublisher }} <span v-if="!bookPublished">(출판 예정)</span>
        </p>
      </div>   
    </div>
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: ''
    },
    imageSrc: {
      type: String,
      required: true
    },
    imageAlt: {
      type: String,
      default: 'Book image'
    },
    bookType: {
      type: String,
      required: true
    },
    bookTitle: {
      type: String,
      required: true
    },
    bookAuthor: {
      type: String,
      required: true
    },
    bookPublisher: {
      type: String,
      required: true
    },
    bookPublished: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleGoRef() {
      window.open(this.href, '_blank');
    }
  }

}
</script>
