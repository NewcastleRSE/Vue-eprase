<template>
  <div class="alert alert-info d-flex" v-if="!dataLoaded">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Saving assessment state...</span>
    </div>
    <div class="flex-grow-1">
      Saving assessment state...
    </div>
  </div>
  <div class="alert alert-danger" v-if="dataLoaded">
    Data has loaded, but logout hasn't proceeded! The fact that you are seeing this means something isn't working properly!
  </div>
</template>

<script>

import { mapState } from 'pinia'
import { authenticationStore } from '../stores/authentication'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AppLogout',
  computed: {
    ...mapState(authenticationStore, ['logout']),
    ...mapState(assessmentStore, ['dataReady', 'setLoggingOut']),
    dataLoaded() {
      return this.dataReady
    }
  },
  watch: {
    dataReady(newVal) {
      console.group('dataReady() watcher entered with new value', newVal)
      if (newVal === true) {
        // We can now log out safely as the store saving process has finished (so user JWT no longer required)
        this.logOutUser()
      }
      console.groupEnd()
    }, immediate: true
  },
  methods: {
    logOutUser() {
      console.debug('Logging out user...')
      this.setLoggingOut(false)
      this.logout()
      this.$router.push('/login?action=loggedOut')
    }
  },
  mounted() {
    if (this.dataLoaded) {
      this.logOutUser()
    }
  },
}
</script>

<style scoped></style>