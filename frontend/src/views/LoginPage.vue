<template>
  <div class="w-full h-[75vh] bg-white flex flex-col items-center justify-center p-4">
    <div class="text-center text-stone-700 text-4xl md:text-5xl font-black leading-10 mb-8">
      <p class="text-xl font-medium text-center text-black/60">누구나 작가가 될 수 있는 곳</p>
      <svg
          width="247"
          height="131"
          viewBox="0 0 247 131"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-[247px] h-[131px] relative"
          preserveAspectRatio="none"
      >
        <rect
            x="26.7227"
            y="87.3041"
            width="55.8266"
            height="22.164"
            transform="rotate(-66.525 26.7227 87.3041)"
            fill="#4343D0"
        ></rect>
        <rect
            x="47.373"
            y="88.7958"
            width="58.552"
            height="22.164"
            transform="rotate(-66.525 47.373 88.7958)"
            fill="#4343D0"
        ></rect>
        <rect
            x="67.5801"
            y="88.6473"
            width="58.552"
            height="22.164"
            transform="rotate(-66.525 67.5801 88.6473)"
            fill="#4343D0"
        ></rect>
        <rect
            x="87.6689"
            y="88.6473"
            width="23.287"
            height="22.164"
            transform="rotate(-66.525 87.6689 88.6473)"
            fill="#4343D0"
        ></rect>
        <path
            d="M228.616 70.7096V88.5267H191.828V70.7096H228.616ZM197.623 50.0205V61.0298H216.37V67.5185H189.711V43.5319H215.866V50.0205H197.623ZM228.616 57.8387V68.3162H220.704V43H228.616V51.3501H233.001V57.8387H228.616ZM199.74 77.145V82.0913H220.704V77.145H199.74Z"
            fill="#4343D0"
        ></path>
        <path
            d="M175.075 51.6163C175.075 52.9991 175.025 54.3287 174.924 55.4988C174.823 56.7753 174.672 57.9453 174.521 59.0091L185.457 67.0401L181.677 72.9436L172.253 66.0295C171.144 67.9974 169.784 69.7525 168.07 71.2417C166.306 72.7841 164.139 74.2733 161.519 75.6561L158.092 69.8589C160.007 68.9015 161.569 67.8378 162.829 66.7209L156.177 61.8811C154.967 64.1149 153.355 66.0827 151.289 67.8378C149.172 69.6461 146.551 71.2949 143.427 72.7841L140 66.9869C142.117 66.0295 143.88 64.9658 145.342 63.9021C146.753 62.8916 147.912 61.7747 148.819 60.5514C149.676 59.3814 150.331 58.0517 150.734 56.5625C151.087 55.1265 151.289 53.4778 151.289 51.6163V43.5321H158.697V51.6163C158.697 52.8927 158.596 54.116 158.394 55.1797L166.458 61.0833C166.861 59.86 167.163 58.4772 167.365 56.9348C167.566 55.4456 167.667 53.6373 167.667 51.6163V43.5321H175.075V51.6163ZM142.066 80.9746H184.146V87.4632H142.066V80.9746Z"
            fill="#4343D0"
        ></path>
        </svg>
      </div>
    <div class="w-full max-w-md space-y-4">
      <button
          class="w-full p-3.5 bg-white rounded-lg shadow flex justify-center items-center gap-3.5 hover:bg-gray-100 transition-colors"
          @click="handleAuthorizeGoogle">
        <img src="../../public/assets/google.png" alt="Google Logo" class="w-6 h-6 object-contain" />
        <div class="text-black/50 text-lg md:text-xl font-medium">
          Google 계정으로 로그인
        </div>
      </button>
      <button
          class="w-full p-3.5 bg-[#ffeb03] rounded-lg shadow flex justify-center items-center gap-3.5 hover:bg-yellow-300 transition-colors"
          style="box-shadow: 0px 0px 3px 0 rgba(0,0,0,0.13);"
          @click="handleAuthorizeKakao">
        <img src="../../public/assets/kakao.png" alt="kakao Logo" class="w-7 h-7 object-contain" />
        <div class="text-xl font-medium text-left text-[#3c1e1e]">
          Kakao 계정으로 로그인
        </div>
      </button>
      <button
          @click="handleAuthorizeNaver"
          class="w-full p-3.5 bg-green-500 rounded-lg shadow flex justify-center items-center gap-3.5 hover:bg-green-600 transition-colors">
        <img src="../../public/assets/naver.png" alt="Naver Logo" class="w-8 h-8 object-contain" />
        <div class="text-white text-lg md:text-xl font-medium px-1">
          Naver 계정으로 로그인
        </div>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    handleAuthorizeGoogle() {
      this.$store.dispatch('authorizeGoogle')
    },
    handleAuthorizeNaver() {
      this.$store.dispatch('authorizeNaver')
    },
    handleAuthorizeKakao() {
      this.$store.dispatch('authorizeKakao')
    },
  }
}
</script>
