<template></template>

<script>

import { mapState } from 'pinia'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "AppLogout",
  computed: {
    ...mapState(authenticationStore, ['logout'])
  },
  mounted() {
    this.logout()
    this.$router.push('/login?action=loggedOut')
  }
}
</script>

<style scoped></style>