<template>
  <div class="flex flex-col justify-center items-center gap-2.5 px-[46px] py-3.5 rounded-xl bg-white border border-[#1ebc4a]/30"
       style="box-shadow: 0px 6px 10.899999618530273px 0 #e1e4e7;">
    <div class="flex justify-start items-end flex-grow-0 flex-shrink-0 relative gap-3">
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
            d="M3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C16.8325 3.25 20.75 7.16751 20.75 12C20.75 16.8325 16.8325 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z"
            fill="#1EBC4A"
        ></path>
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.9425 9.9415L11.0005 15.8834L7.55859 12.4415L8.44248 11.5576L11.0005 14.1157L16.0586 9.05762L16.9425 9.9415Z"
            fill="#1EBC4A"
        ></path>
      </svg>
      <p class="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#1b1b1b]">
        {{message}}
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: ['recommendState'],
  computed: {
    message(){
      if(this.recommendState == 4){
        return "목차 구성이 완료되었습니다."
      }
      return "몸통 박치기"
    }
  }


}
</script>