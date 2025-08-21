<template>
  <div @click="$emit('closeClicked')" class="relative">
    <svg 
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8 relative"
      preserveAspectRatio="xMidYMid meet">
      <rect class="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 ease-in-out opacity-100 hover:opacity-0" rx="16" fill="#F8F8F8"></rect>
      <rect class="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" rx="16" fill="rgb(229 231 235)"></rect>
      <path
        d="M15.9997 14.5865L20.2424 10.3438C20.6329 9.9533 21.2661 9.9533 21.6566 10.3438C22.0471 10.7343 22.0471 11.3675 21.6566 11.758L17.4139 16.0007L21.6566 20.2433C22.0471 20.6338 22.0471 21.267 21.6566 21.6575C21.2661 22.048 20.6329 22.048 20.2424 21.6575L15.9997 17.4149L11.7571 21.6575C11.3665 22.048 10.7334 22.048 10.3429 21.6575C9.95233 21.267 9.95233 20.6338 10.3429 20.2433L14.5855 16.0007L10.3428 11.758C9.95232 11.3675 9.95233 10.7343 10.3429 10.3438C10.7334 9.9533 11.3665 9.9533 11.7571 10.3438L15.9997 14.5865Z"
        fill="#B9B9B7">
      </path>
    </svg>
  </div>
</template>

<script>
export default {
  emits: ['closeClicked'],
}
</script>
