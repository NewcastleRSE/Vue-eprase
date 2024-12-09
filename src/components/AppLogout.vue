<template></template>

<script>

import { mapStores } from 'pinia'
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'

export default {
  name: "AppLogout",
  computed: {
    ...mapStores(authenticationStore, rootStore)
  },
  mounted() {
    rootStore().audit('Successful logout', '/logout')
    authenticationStore().logout()    
    this.$router.push('/login?loggedOut=1')
  }
}
</script>

<style scoped></style>