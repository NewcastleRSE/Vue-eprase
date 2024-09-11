<template>
  <GenericModal :modalName="'ContactModal'" :modalId="'contactModal'" :title="'Contacts for ePRaSE'"
    :closeBtnText="'Close'">
    <p> Contacts for the ePrase project are:</p>
    <ul class="list-group">      
      <li class="list-group-item">
        <i class="bi bi-envelope pe-2"></i>
        nuth.eprase@nhs.net
      </li>     
    </ul>
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'
import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'

export default {
  name: "ContactModal",
  components: {
    GenericModal
  },
  computed: {
    ...mapStores(rootStore)
  },
  methods: {
    close() {
      rootStore().audit('View contact', '/assessmentintro')
    }
  }
}
</script>

<style scoped></style>
