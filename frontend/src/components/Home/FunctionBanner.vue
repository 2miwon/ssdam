<template>
  <div id="banner" class="flex flex-col justify-center items-center h-[200px] px-5">
    <div class="box p-2.5 flex items-end rounded">
      <h4 class="m-0">{{ bannerTitle }}</h4>
    </div>
    <div class="box gray flex flex-col justify-center items-center bg-gray-200 p-2.5 rounded mt-2.5">
      <div>
        <h1 class="m-0">{{ bannerTitle }}</h1>
      </div>
      <div>
        <h1 class="m-0">설명 사진</h1>
      </div>
    </div>
  </div>
  <hr>
</template>

<script>
export default {
  props: ['bannerTitle']
}
</script>

