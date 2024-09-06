<template>
  <GenericModal :modalName="'ConfirmDeleteModal'" :modalId="'confirmDeleteModal'" :title="'Confirm delete?'"
    :actionBtnText="'Yes'" :actionBtnCls="'btn-danger'" :closeBtnText="'No'">
    Records deleted cannot be recovered
  </GenericModal>
</template>

<script>

import { setVisible } from '../helpers/modal'
import GenericModal from './GenericModal'

export default {
  name: "ExitModal", 
  components: {
    GenericModal
  },
  methods: {
    show() {
      setVisible('confirmDeleteModal', true)
    }
  }
}
</script>

<style scoped></style>
