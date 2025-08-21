<template>
  <div class="flex flex-col justify-center items-center gap-2.5 px-[46px] py-3.5 rounded-xl bg-white border border-[#ffd402]/30"
       style="box-shadow: 0px 6px 10.899999618530273px 0 #e1e4e7;">
    <div class="flex justify-start items-end flex-grow-0 flex-shrink-0 relative gap-3">
      <div>
        <svg
             width="24"
             height="24"
             viewBox="0 0 24 24"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
             class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
             preserveAspectRatio="xMidYMid meet">
          <rect
              x="0.75"
              y="0.75"
              width="22.5"
              height="22.5"
              rx="11.25"
              stroke="#FFD402"
              stroke-width="1.5">
          </rect>
          <path d="M12.75 16.575H11.25V18.375H12.75V16.575Z" fill="#FFD402"></path>
          <path d="M13.5 6.375H10.5L11.25 14.025H12.75L13.5 6.375Z" fill="#FFD402"></path>
        </svg>
      </div>
      <p class="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#1b1b1b]">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: ['message']
}
</script>