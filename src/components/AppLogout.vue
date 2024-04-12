<template></template>

<script>

import { mapStores } from 'pinia'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "AppLogout",
  computed: {
    ...mapStores(authenticationStore)
  },
  mounted() {
    authenticationStore().logout()
    this.$router.push('/login?loggedOut=1')
  }
}
</script>

<style scoped></style>