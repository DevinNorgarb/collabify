<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    user() {
      return this.$store.state.spotifyAuth
    }
  }
}
</script>
