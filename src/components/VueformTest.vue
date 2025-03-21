<template>
  <div id="app">
    <Vueform>
      <TextElement name="hello_world" label="Hello" placeholder="World" />
    </Vueform>
  </div>
</template>

<script>

import { Vueform, TextElement } from '@vueform/vueform'

export default {
  name: "VueformTest"
}

</script>

<style scoped>
</style>