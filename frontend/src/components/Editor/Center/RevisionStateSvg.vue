<template>
  <svg v-if="borderLine == 'border-[#1ebc4a]/30'"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
    preserveAspectRatio="none">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C16.8325 3.25 20.75 7.16751 20.75 12C20.75 16.8325 16.8325 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z"
    fill="#1EBC4A">
  </path>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M16.9425 9.9415L11.0005 15.8834L7.55859 12.4415L8.44248 11.5576L11.0005 14.1157L16.0586 9.05762L16.9425 9.9415Z"
    fill="#1EBC4A">
  </path>
  </svg>

  <svg v-else-if="borderLine == 'border-[#ffd402]/30'"
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

  <svg v-else
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style="flex-grow: 0; flex-shrink: 0; width: 24px; height: 24px; position: relative;"
    preserveAspectRatio="xMidYMid meet">
  <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#FF7171"></rect>
  <path
    d="M11.9998 10.5649L15.1818 7.38287C15.4747 7.08997 15.9496 7.08998 16.2425 7.38287C16.5353 7.67576 16.5353 8.15063 16.2424 8.44352L13.0604 11.6255L16.2424 14.8075C16.5353 15.1004 16.5353 15.5752 16.2424 15.8681C15.9496 16.161 15.4747 16.161 15.1818 15.8681L11.9998 12.6862L8.8178 15.8681C8.52491 16.161 8.05004 16.161 7.75715 15.8681C7.46425 15.5752 7.46425 15.1004 7.75715 14.8075L10.9391 11.6255L7.75714 8.44353C7.46424 8.15063 7.46425 7.67576 7.75714 7.38287C8.05003 7.08998 8.52491 7.08998 8.8178 7.38287L11.9998 10.5649Z"
    fill="#FF7171">
  </path>
  </svg>
</template>

<script>
export default {
  props: ['borderLine']
}
</script>
<style lang="scss" scoped>

</style>