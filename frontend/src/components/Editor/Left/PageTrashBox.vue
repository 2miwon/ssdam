<template>
  <div class="flex h-[52px] m-2 p-2 rounded-[10px] justify-between hover:bg-gray-200 cursor-pointer">
    <div class="flex w-full justify-start items-center gap-[3px]">
      <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="flex-grow-0 flex-shrink-0 w-6 h-6"
          preserveAspectRatio="none">
          <path
            d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM16 11V13H8V11H16Z"
            fill="#727272">
          </path>
          <path d="M16 17V15H8V17H16Z" fill="#727272"></path>
        </svg>
      </div>
      <div class="flex-grow truncate">
        <p class="text-sm font-medium text-left text-[#494949] truncate">
          {{ page.title.length==0 ? '제목없음' : page.title }}
        </p>
        <p class="text-xs font-medium text-left text-[#b3b7bc]">
          {{ this.formatDate(page.deleted_at) }}
        </p>
      </div>
      <div class="flex gap-3 p-2.5">
        <svg @click="handleRestore"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 items-center justify-center rounded hover:bg-gray-300"
          preserveAspectRatio="none">
          <path
            d="M5.69037 5.83312H11.6667C14.4281 5.83312 16.6667 8.0717 16.6667 10.8332C16.6667 13.5946 14.4281 15.8332 11.6667 15.8332H4.16671V17.4998H11.6667C15.3486 17.4998 18.3334 14.515 18.3334 10.8332C18.3334 7.15123 15.3486 4.16646 11.6667 4.16646H5.69037L7.80337 2.05352L6.62479 0.875L2.50004 4.99979L6.62479 9.12458L7.80337 7.94608L5.69037 5.83312Z"
            fill="#727272">
          </path>
        </svg>
        <svg @click="handleDelete"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 rounded hover:bg-gray-300"
          preserveAspectRatio="none">
          <path
            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"
            fill="#727272">
          </path>
        </svg>
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    props: ['page'],
    methods: {
      formatDate(dateString) {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      handleRestore() {
        this.$emit('restore');
      },
      handleDelete() {
        this.$emit('delete');
      },
    }
  }
</script>