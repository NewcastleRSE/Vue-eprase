<template>
  <div class="row">
    <div>
      <div class="p-2 float-end bg-primary opacity-75 rounded-2 text-white fw-bold"
        v-if="authenticationStore.isLoggedIn"><i class="bi bi-person-circle pe-2 fs-4"></i>Logged in as {{
          authenticationStore.user }} @ {{ authenticationStore.orgName }}</div>
      <div class="p-2 float-end bg-primary opacity-75 rounded-2 text-white fw-bold"
        v-if="!authenticationStore.isLoggedIn"><i class="bi bi-person-circle pe-2 fs-4"></i>You are not logged in</div>
    </div>
  </div>
</template>

<script>

import { mapStores } from 'pinia'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "LoginInfo",
  computed: {
    ...mapStores(authenticationStore)
  }
}

</script>

<style scoped></style>
