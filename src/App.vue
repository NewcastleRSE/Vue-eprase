<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'
import { Tooltip } from 'bootstrap'

export default {
  name: "app",
  components: {
    RouterView,
    Tooltip
  }, 
  mounted() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
      trigger: 'hover'
    })    
  }
}
</script>

<style></style>
