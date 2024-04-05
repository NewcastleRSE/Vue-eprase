<template>
  <GenericModal :modalName="'ErrorAlertModal'" :modalId="'errorAlertModal'" :title="'The following error occurred'" :closeBtnText="'Close'">
    <div class="bg-danger-subtle text-danger-emphasis">{{ errorText }}</div>
  </GenericModal>
</template>

<script>

import Modal from 'bootstrap/js/dist/modal'
import GenericModal from './GenericModal'

export default {
  name: "ErrorAlertModal",
  data() {
    return {
      errorText: ''
    }
  },
  computed: {
    childModal() {
      const markup = document.querySelector('#errorAlertModal')
      return Modal.getInstance(markup) || new Modal(markup)
    }
  },
  components: {
    GenericModal
  },
  methods: {
    close() {
      this.errorText = ''
      this.childModal.hide()
    },
    show(text) {
      this.errorText = text
      this.childModal.show()
    }
  }
}
</script>

<style scoped></style>
