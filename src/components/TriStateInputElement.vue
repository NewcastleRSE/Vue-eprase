<template>
  <ElementLayout>
    <template #element>
      <div class="tristate-radio-group">
        <input type="radio" :name="name" :id="id + '-yes'" value="yes" />
        <label :for="id + '-yes'" title="Yes"><i class="bi bi-check-circle-fill"></i></label>
        <input type="radio" :name="name" :id="id + '-unset'" value="unset" checked />
        <label :for="id + '-unset'" title="Not answered yet"><i class="bi bi-dash-circle-fill"></i></label>
        <input type="radio" :name="name" :id="id + '-no'" value="no" />
        <label :for="id + '-no'" title="No"><i class="bi bi-x-circle-fill"></i></label>
      </div>
    </template>    
  </ElementLayout>  
</template>

<script>

import { defineElement } from '@vueform/vueform'

export default defineElement ({
  name: 'TriStateInputElement',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
})

</script>

<style lang="scss" scoped></style>