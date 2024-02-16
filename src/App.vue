<template>
  <RouterView />
</template>

<script>
import { RouterView } from "vue-router";

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
};
</script>

<style></style>
