<template>
  <GenericModal :modalName="'ExitModal'" :modalId="'exitModal'" :title="'Are you sure you want to exit?'"
    :actionBtnText="'Log out'" :closeBtnText="'Close'">
    The current state of your work will be saved and can be resumed later
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'

export default {
  name: "ExitModal",  
  components: {
    GenericModal
  }
}
</script>

<style scoped></style>
