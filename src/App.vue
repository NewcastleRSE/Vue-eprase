<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'
import { Tooltip } from 'bootstrap'

export default {
  name: "app",
  components: {}, 
  mounted() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })
  }
}
</script>

<style></style>
