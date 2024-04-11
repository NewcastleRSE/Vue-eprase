<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'
import { Tooltip } from 'bootstrap'

export default {
  name: "app",
  components: {},
  computed: {
    /*alert () {
          return this.$store.state.alert
      } */
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      // this.$store.dispatch('alert/clear');
    },
  },
  mounted() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })
  }
}
</script>

<style></style>
