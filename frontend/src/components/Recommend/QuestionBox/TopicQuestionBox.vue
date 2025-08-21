<template>
  <div class="w-[65vw] mx-auto min-h-24 my-1">
    <div
        :class="['text-zinc-900 font-bold leading-tight', isMobile ? 'text-base' : 'text-xl']">
      <div>이야기하고 싶은 주제를 알려주세요.</div>
      <div class="block">3번의 단계만 거치면 목차가 만들어집니다!</div>
    </div>
    <div
        :class="['text-gray-400 font-normal leading-normal mt-2', isMobile ? 'text-sm' : 'text-base']">
      이미 생각하고 계신 목차가 있다면, 해당 과정을 건너뛸 수 있습니다.
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return window.innerWidth < 660
    },
  }
}
</script>
