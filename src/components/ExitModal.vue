<template>
  <GenericModal :modalName="'ExitModal'" :modalId="'exitModal'" :title="'Are you sure you want to exit?'"
    :actionBtnText="'Log out'" :closeBtnText="'Close'">
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'

export default {
  name: "ExitModal",
  data() {
    return {
      box: ''
    }
  },
  components: {
    GenericModal
  },  
  methods: {   
    exit() {
      this.$router.push('/logout')
    }
  }
}
</script>

<style scoped></style>
