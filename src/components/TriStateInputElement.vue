<template>
  <ElementLayout>
    <template #element>
      <div class="tristate-radio-group">
        <input type="radio" :name="name" :id="name + '-yes'" value="yes" @change="function(evt) { tristateValue = evt.target.value }" />
        <label :for="name + '-yes'" title="Yes">
          <i v-if="tristateValue == 'yes'" class="bi bi-check-circle-fill"></i>
          <i v-if="tristateValue != 'yes'" class="bi bi-check-circle"></i>
        </label>
        <input type="radio" :name="name" :id="name + '-unset'" value="unset" checked @change="function(evt) { tristateValue = evt.target.value }" />
        <label :for="name + '-unset'" title="Not answered yet">
          <i v-if="tristateValue == 'unset'" class='bi bi-dash-circle-fill'></i>
          <i v-if="tristateValue != 'unset'" class='bi bi-dash-circle'></i>
        </label>
        <input type="radio" :name="name" :id="name + '-no'" value="no" @change="function(evt) { tristateValue = evt.target.value }" />
        <label :for="name + '-no'" title="No">
          <i v-if="tristateValue == 'no'" class='bi bi-x-circle-fill'></i>
          <i v-if="tristateValue != 'no'" class='bi bi-x-circle'></i>
        </label>
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
      tristateValue: 'unset'
    }
  }
})

</script>

<style lang="scss" scoped></style>