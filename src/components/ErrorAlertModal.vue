<template>
  <GenericModal :modalName="'ErrorAlertModal'" :modalId="'alertModal'" :title="'The following error occurred'" :closeBtnText="'Close'">
    <div class="bg-danger-subtle text-danger-emphasis">
      <h5 class="fw-bolder">There was an unexpected error during this operation:</h5>
      <p>{{ errorText }}</p>
    </div>
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
  },
  methods: {
    close() {
      this.errorText = ''
    }
  }
}
</script>

<style scoped></style>
