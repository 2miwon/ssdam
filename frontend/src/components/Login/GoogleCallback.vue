<template>
  <div>
  </div>
</template>

<script>
export default {
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    window.fbq('trackCustom', 'SignUp', {SingUpUrl: 'SingUpUrl'});
    if (urlParams) {
      await this.$store.dispatch('handleGoogleCallback', urlParams);
    } else {
      console.error('No code found in URL');
    }
  }
}
</script>
