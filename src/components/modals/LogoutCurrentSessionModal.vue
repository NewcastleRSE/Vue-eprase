<template>
  <GenericModal :modalName="'LogoutCurrentSessionModal'" :modalId="'logoutCurrentSessionModal'" :title="'Are you sure you want to log out?'"
    :actionBtnText="'Log out'" :closeBtnText="'Close'">
    Other active sessions you may have on other devices will be unaffected
  </GenericModal>
</template>

<script>

import { setVisible } from '../../helpers/modal'
import GenericModal from './GenericModal'

export default {
  name: "LogoutCurrentSessionModal", 
  components: {
    GenericModal
  },
  methods: {
    show() {
      setVisible('logoutCurrentSessionModal', true)
    }
  }
}
</script>

<style scoped></style>
