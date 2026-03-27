<template>
  <GenericModal :modalName="'LogoutOtherSessionsModal'" :modalId="'logoutOtherSessionsModal'" :title="'Ok to terminate these sessions on other devices?'"
    :actionBtnText="'Terminate'" :closeBtnText="'Close'">
    Your current session on this device will be unaffected
  </GenericModal>
</template>

<script>

import { setVisible } from '../../helpers/modal'
import GenericModal from './GenericModal'

export default {
  name: "LogoutOtherSessionsModal", 
  components: {
    GenericModal
  },
  methods: {
    show() {
      setVisible('logoutOtherSessionsModal', true)
    }
  }
}
</script>

<style scoped></style>
