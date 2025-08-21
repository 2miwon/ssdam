<template>
  <div class="hover-button">
    <div class="flex-container">
      <p class="button-text">
        무료로 쓰담 시작하기
      </p>
      <svg
          width="37"
          height="37"
          viewBox="0 0 37 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          preserveAspectRatio="none">
        <g clip-path="url(#clip0_1838_3839)">
          <path d="M6.5 17H29V19.25H6.5V17Z" fill="white"></path>
          <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M27.1456 18.5L18.499 9.70542L20.1757 8L30.499 18.5L20.1757 29L18.499 27.2946L27.1456 18.5Z"
              fill="white"
          ></path>
        </g>
        <defs>
          <clipPath id="clip0_1838_3839">
            <rect width="36" height="36" fill="white" transform="translate(0.5 0.5)"></rect>
          </clipPath>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.hover-button {
  @apply w-[66vw] sm:w-[480px] flex justify-center items-center flex-grow-0 flex-shrink-0 h-[56px] sm:h-[85px] gap-[2.5px] p-[5px_8px] rounded-[12px] sm:rounded-[20px] cursor-pointer overflow-hidden;
  background: linear-gradient(129.78deg, #4343d0 19.07%, #900afa 93.09%);
  position: relative;
}

.hover-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #6146ff; /* Adjust the color and transparency as needed */
  opacity: 0;
  transition: opacity 0.3s;
}

.hover-button:hover::before {
  opacity: 1;
}

.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  gap: 1px;
  position: relative;
  z-index: 1; /* Ensure content is above the pseudo-element */
}

.button-text {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: white;
  border-radius: 12px;
}

.icon {
  flex-grow: 0;
  flex-shrink: 0;
  width: 37px;
  height: 37px;
  position: relative;
}

@media screen and (max-width: 640px) {
  .button-text {
    font-size: 16px;
  }
  .icon {
    width: 25px;
    height: 25px;
  }
}


</style>