<template>
  <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-1">
    <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1.5">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
        preserveAspectRatio="none">
        <path
          d="M17.0007 1.20801L18.3195 3.68084L20.7923 4.99968L18.3195 6.31852L17.0007 8.79135L15.6818 6.31852L13.209 4.99968L15.6818 3.68084L17.0007 1.20801ZM8.00065 4.33301L10.6673 9.33301L15.6673 11.9997L10.6673 14.6664L8.00065 19.6664L5.33398 14.6664L0.333984 11.9997L5.33398 9.33301L8.00065 4.33301ZM19.6673 16.3331L18.0007 13.2081L16.334 16.3331L13.209 17.9997L16.334 19.6664L18.0007 22.7914L19.6673 19.6664L22.7923 17.9997L19.6673 16.3331Z"
          fill="url(#paint0_linear_1572_2276)">
        </path>
        <defs>
          <linearGradient
            id="paint0_linear_1572_2276"
            x1="3.50991"
            y1="6.60385"
            x2="23.852"
            y2="11.8098"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4343D0"></stop>
            <stop offset="1" stop-color="#900AFA"></stop>
          </linearGradient>
        </defs>
      </svg>
      <p class="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-[#1b1b1b]">
        수정 이유
      </p>
    </div>
    <p class="self-stretch flex-grow-0 flex-shrink-0 w-[163px] text-sm text-left text-[#a8a8a8]">
      {{ userCheckLeft + '개의 수정 항목이 존재해요'}}
    </p>
  </div>
</template>

<script>
  export default {
    props: ['userCheckLeft']
    
  }
</script>