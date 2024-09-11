<template>
  <GenericModal :modalName="'ConfirmCancelEditModal'" :modalId="'confirmCancelEditModal'" :title="'Confirm cancel'"
    :actionBtnText="'Yes'" :actionBtnCls="'btn-warning'" :closeBtnText="'No'">
    Any edits you have made will be lost!
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
      setVisible('confirmCancelEditModal', true)
    }
  }
}
</script>

<style scoped></style>
