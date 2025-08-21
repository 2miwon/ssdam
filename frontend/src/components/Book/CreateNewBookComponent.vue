<template>
  <div class="book-component w-full h-auto flex flex-col justify-start items-start gap-3">
    <div class="w-full h-[80%] relative bg-zinc-100 rounded-2xl shadow border border-zinc-100 flex justify-center items-center">
      <div class="w-full h-full absolute left-0 top-0 rounded-tr-2xl rounded-br-2xl flex justify-center items-center">
        <div class="flex flex-col justify-center items-center gap-1.5">
          <div class="w-8 h-8 bg-zinc-400 rounded-2xl flex justify-center items-center">
            <img class="w-4 h-4" src="../../../public/assets/plus.png" />
          </div>
          <div class="text-center text-zinc-500 text-base font-medium leading-normal">책 만들기</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.book-component {
  aspect-ratio: 262 / 409;
  max-width: 262px;
  max-height: 409px;
}
</style>
