<template>
  <div>
    <div class="fixed inset-0 bg-black bg-opacity-40 flex z-20"></div>
    <div class="fixed flex flex-col w-[309px] h-[103px] z-30">
      <div>
        <svg v-if="pointerPosition == 0 || pointerPosition == 1"
          width="24"
          height="15"
          viewBox="0 0 24 15"
          fill="none"
          stroke="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'ml-[30px]':pointerPosition==0, 'ml-[250px]':pointerPosition==1 }"
          preserveAspectRatio="none">
          <path d="M12 0L23.2583 15H0.74167L12 0Z" fill="#6146FF"></path>
        </svg>
        <div class="flex flex-col justify-start items-start">
          <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[309px] gap-4 px-4 pt-5 pb-2 rounded-[14px] bg-[#6146ff]">
            <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              <div class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
                <p v-if="messageTwo" class="flex-grow w-[277px] text-sm font-semibold text-left text-white">
                <span class="flex-grow w-[277px] text-sm font-semibold text-left text-white">{{message}}</span>
                  <br />
                  <span class="flex-grow w-[277px] text-sm font-semibold text-left text-white">{{ messageTwo }}</span>
                </p>
                <p v-else class="flex-grow w-[277px] text-sm font-semibold text-left text-white">
                  {{ message }}
                </p>
              </div>
            </div>
            <div class="flex flex-col justify-start items-end self-stretch flex-grow-0 flex-shrink-0 gap-1.5">
              <div class="flex justify-end items-center flex-grow-0 flex-shrink-0 relative gap-2">
                <svg @click="handleClick"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-grow-0 flex-shrink-0 w-6 h-6 relative cursor-pointer"
                  preserveAspectRatio="none">
                  <path
                    d="M10.25 14.6471L17.8333 7L19 8.17647L10.25 17L5 11.7059L6.16667 10.5295L10.25 14.6471Z"
                    fill="white"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <svg v-if="pointerPosition == 2 || pointerPosition == 3"
          width="24"
          height="15"
          viewBox="0 0 24 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'ml-[30px]':pointerPosition==2, 'ml-[250px]':pointerPosition==3 }"
          preserveAspectRatio="none">
          <path d="M12 15L0.741669 0L23.2583 0L12 15Z" fill="#6146FF"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['pointerPosition', 'message', 'messageTwo'],
    methods: {
      handleClick() {
        this.$emit('close');
      }
    },
  }
</script>