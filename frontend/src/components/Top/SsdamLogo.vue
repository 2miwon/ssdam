<template>
  <div
    class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2 cursor-pointer">
    <svg 
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-grow-0 flex-shrink-0 relative"
      :class="{ 'w-8 h-8': isMobile && (this.$route.name=='book' || this.$route.name=='editor'), 'w-11 h-11': !isMobile }"
      preserveAspectRatio="xMidYMid meet">
      <g clip-path="url(#clip0_1838_4183)">
        <rect
          x="-0.241211"
          y="32.4326"
          width="27.4275"
          height="10.8892"
          transform="rotate(-66.525 -0.241211 32.4326)"
          fill="#4343D0">
        </rect>
        <rect
          x="9.90137"
          y="33.1636"
          width="28.7665"
          height="10.8892"
          transform="rotate(-66.525 9.90137 33.1636)"
          fill="#4343D0">
        </rect>
        <rect
          x="19.8232"
          y="33.0897"
          width="28.7665"
          height="10.8892"
          transform="rotate(-66.525 19.8232 33.0897)"
          fill="#4343D0">
        </rect>
        <rect
          x="29.7041"
          y="33.0897"
          width="11.4409"
          height="10.8892"
          transform="rotate(-66.525 29.7041 33.0897)"
          fill="#4343D0">
        </rect>
      </g>
      <defs>
        <clipPath id="clip0_1838_4183"><rect width="44" height="44" fill="white"></rect></clipPath>
      </defs>
    </svg>
    <svg v-if="this.$route.name == 'home'"
      width="34"
      height="18"
      viewBox="0 0 34 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-grow-0 flex-shrink-0 w-[34px] h-[16.64px]"
      preserveAspectRatio="none">
      <path
        d="M32.397 10.8082V17.3219H18.9476V10.8082H32.397ZM21.0664 3.24456V7.26943H27.92V9.64157H18.1738V0.872416H27.7358V3.24456H21.0664ZM32.397 6.1028V9.93323H29.5045V0.677979H32.397V3.73066H33.9999V6.1028H32.397ZM21.8402 13.1609V14.9692H29.5045V13.1609H21.8402Z"
        fill="#4343D0">
      </path>
      <path
        d="M12.823 3.82789C12.823 4.33343 12.8045 4.81953 12.7677 5.24729C12.7308 5.71394 12.6756 6.14171 12.6203 6.53058L16.6183 9.4666L15.2365 11.6249L11.7912 9.09717C11.3859 9.81659 10.8885 10.4582 10.2621 11.0027C9.61722 11.5665 8.825 12.111 7.86696 12.6165L6.61414 10.4971C7.31425 10.1471 7.88539 9.75826 8.34598 9.34994L5.91404 7.58055C5.47187 8.39719 4.88231 9.11661 4.12693 9.75826C3.35313 10.4193 2.39509 11.0221 1.25282 11.5665L0 9.44715C0.7738 9.09717 1.41863 8.70829 1.95292 8.31941C2.46879 7.94998 2.89254 7.54166 3.22416 7.09445C3.53737 6.66669 3.77688 6.18059 3.92427 5.63617C4.05324 5.11119 4.12693 4.50843 4.12693 3.82789V0.872437H6.83523V3.82789C6.83523 4.29455 6.79838 4.74175 6.72469 5.13063L9.67249 7.28889C9.81988 6.84168 9.93043 6.33615 10.0041 5.77228C10.0778 5.22785 10.1147 4.56676 10.1147 3.82789V0.872437H12.823V3.82789ZM0.755376 14.5609H16.1392V16.933H0.755376V14.5609Z"
        fill="#4343D0">
      </path>
    </svg>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        screenWidth: window.innerWidth
      }
    },
    mounted() {
      window.addEventListener('resize', this.handleResize)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize)
    },
    computed: {
      isMobile() {
        return this.screenWidth < 660
      }
    },
    methods: {
      handleResize() {
        this.screenWidth = window.innerWidth
      }
    },
  }
</script>