<template>
  <GenericModal :modalName="'ErrorAlertModal'" :modalId="'errorAlertModal'" :title="'The following error occurred'" :closeBtnText="'Close'">
    <div class="bg-danger-subtle p-2 text-danger-emphasis">{{ errorText }}</div>
  </GenericModal>
</template>

<script>

import { setVisible } from '../helpers/modal'
import GenericModal from './GenericModal'

export default {
  name: "ErrorAlertModal",
  data() {
    return {
      errorText: ''
    }
  },
  components: {
    GenericModal
  },
  methods: {
    close() {
      this.errorText = ''
      setVisible('errorAlertModal', false)
    },
    show(text) {
      this.errorText = text
      setVisible('errorAlertModal', true)
    }
  }
}
</script>

<style scoped></style>
