<template>
  <GenericModal :modalName="'ForgotPasswordModal'" :modalId="'forgotPasswordModal'" :title="'Reset your ePRaSE password'"
    :closeBtnText="'Close'">
    <p>Please contact the ePRaSE administrators by email to receive a new password using the address below:</p>
    <ul class="list-group">      
      <li class="list-group-item">
        <i class="bi bi-envelope pe-2"></i>
        <a href="mailto:nuth.eprase@nhs.net">nuth.eprase@nhs.net</a>
      </li>     
    </ul>
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'

export default {
  name: "ForgotPasswordModal",
  components: {
    GenericModal
  }
}
</script>

<style scoped></style>
