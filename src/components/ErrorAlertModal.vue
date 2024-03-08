<template>
  <GenericModal :modalName="'ErrorAlertModal'" :modalId="'alertModal'" :title="'The following error occurred'" :closeBtnText="'Close'">
    <slot></slot>
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'

export default {
  name: "ErrorAlertModal",
  props: {
    errorText: ''
  },
  components: {
    GenericModal
  }
}
</script>

<style scoped></style>
