<template>
  <!-- <div class="bg-sky-50"> -->
  <div class="">
    <div class="flex-col relative w-[70vw] h-auto mx-auto px-4 py-[40px]">
      <div class="flex justify-center items-center pb-[30px]">
        <p class="text-[27px] sm:text-4xl font-bold bg-gradient-to-r from-[#0D5FFF] to-[#17AFF0] text-transparent bg-clip-text">서비스 소개 영상</p>
      </div>
      <div class="flex overflow-hidden rounded-xl shadow-lg"> <!-- 추가된 클래스 -->
        <video
            autoplay muted
            class="w-auto h-auto max-h-[80vh] object-contain"
            controls
            :poster="thumbnailUrl">
          <source :src="videoSource" type="video/mp4">
        </video>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      videoSource: 'https://ssdam-marketing-material.s3.ap-northeast-2.amazonaws.com/ssdam_ad_general.mp4', // 실제 비디오 URL로 교체하세요
      thumbnailUrl: 'https://ssdam-marketing-material.s3.ap-northeast-2.amazonaws.com/thumbnail.png' // 실제 썸네일 이미지 URL로 교체하세요

  }
  }
}
</script>